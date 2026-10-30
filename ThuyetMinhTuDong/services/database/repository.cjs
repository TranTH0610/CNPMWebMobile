/**
 * FILE NÀY LÀM GÌ: Lưu nội dung, QR và phiên hoạt động bằng SQL Server.
 * Catalog/presence server sử dụng; phụ thuộc connection.cjs và schema.sql.
 * TẠI SAO: Mọi thiết bị đọc cùng database; restart Node không xóa nội dung và lượt QR.
 */
const { connect } = require('./connection.cjs')
const { readDocument, writeDocument } = require('./catalog-relational.cjs')

function createSqlRepository({ scope = 'main', now = Date.now, ttlMs = 90000, maxSessions = 10000 } = {}) {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(scope)) throw Error('invalid_scope')
  const dayOf = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(now()))

  // CHỨC NĂNG: Bind tất cả giá trị đầu vào, tránh ghép dữ liệu người dùng vào câu SQL.
  async function query(executor, text, values = {}) {
    const { sql } = await connect()
    const request = executor.request()
    request.input('scope', sql.NVarChar(100), scope)
    for (const [key, value] of Object.entries(values)) {
      const type = typeof value === 'number' ? sql.BigInt : sql.NVarChar(sql.MAX)
      request.input(key, type, value)
    }
    return request.query(text)
  }

  // CHỨC NĂNG: Khóa theo tác vụ trong transaction, kể cả nhiều tiến trình API.
  // TẠI SAO: Hai admin cùng revision hoặc hai heartbeat đồng thời không được ghi đè/đếm trùng.
  async function locked(resource, action) {
    const { sql, pool } = await connect()
    const transaction = new sql.Transaction(pool)
    // App lock đã tuần tự hóa cùng nghiệp vụ/scope; READ COMMITTED tránh khóa dải
    // của scope test khác hoặc của tác vụ QR/phiên trên cùng database.
    await transaction.begin(sql.ISOLATION_LEVEL.READ_COMMITTED)
    try {
      await query(transaction, `DECLARE @result int;
        EXEC @result=sys.sp_getapplock @Resource=@resource,@LockMode='Exclusive',@LockOwner='Transaction',@LockTimeout=10000;
        IF @result<0 THROW 51000,'database_busy',1;`, { resource: `HueGuide:${scope}:${resource}` })
      const result = await action(transaction)
      await transaction.commit()
      return result
    } catch (error) {
      try { await transaction.rollback() } catch { /* SQL có thể đã tự rollback. */ }
      throw error
    }
  }

  return {
    // Mỗi request ghép tài liệu API từ bảng quan hệ; JSON chỉ dùng tại biên service.
    catalog: action => locked('catalog', async transaction => {
      const { sql } = await connect()
      return action({
        read: async () => { const document=await readDocument(transaction,sql,scope);return document===null?null:JSON.stringify(document) },
        write: async payload => {
          if(Buffer.byteLength(payload)>32*1024*1024)throw Error('capacity')
          await writeDocument(transaction,sql,scope,JSON.parse(payload))
        },
      })
    }),
    version: async () => {
      const { pool } = await connect()
      const result = await query(pool, 'SELECT Revision FROM dbo.CatalogScopes WHERE Scope=@scope')
      return String(result.recordset[0]?.Revision ?? 0)
    },
    gateStatistics: async () => {
      const { pool } = await connect(), day = dayOf()
      const result = await query(pool, `SELECT (SELECT COUNT(*) FROM dbo.GateEntries WHERE Scope=@scope AND VisitDay=CONVERT(date,@day))
        + COALESCE((SELECT Total FROM dbo.GateCarry WHERE Scope=@scope AND VisitDay=CONVERT(date,@day)),0) AS today`, { day })
      return { today: result.recordset[0].today, day }
    },
    gateEntry: (visitId, platform) => locked('gate', async transaction => {
      const day = dayOf()
      const result = await query(transaction, `SELECT COUNT(*) AS total FROM dbo.GateEntries WHERE Scope=@scope AND VisitDay=CONVERT(date,@day);
        SELECT VisitId FROM dbo.GateEntries WHERE Scope=@scope AND VisitDay=CONVERT(date,@day) AND VisitId=@visitId;`, { day, visitId })
      if (result.recordsets[1].length) return
      if (result.recordsets[0][0].total >= 50000) throw Error('capacity')
      await query(transaction, `INSERT dbo.GateEntries(Scope,VisitDay,VisitId,Platform) VALUES(@scope,CONVERT(date,@day),@visitId,@platform)`, { day, visitId, platform })
    }),
    // Chỉ nhập tổng từ RAM cũ một lần cho ngày đó, không đụng đến lượt SQL đã có.
    importGate: gate => locked('gate', async transaction => {
      if (!gate || !/^\d{4}-\d{2}-\d{2}$/.test(gate.day) || !Number.isSafeInteger(gate.today) || gate.today < 0) throw Error('invalid_gate')
      await query(transaction, `IF NOT EXISTS(SELECT 1 FROM dbo.GateCarry WHERE Scope=@scope AND VisitDay=CONVERT(date,@day))
        AND NOT EXISTS(SELECT 1 FROM dbo.GateEntries WHERE Scope=@scope AND VisitDay=CONVERT(date,@day))
        INSERT dbo.GateCarry(Scope,VisitDay,Total) VALUES(@scope,CONVERT(date,@day),@total)`, { day: gate.day, total: gate.today })
    }),
    heartbeat: ({ sessionId, platform }) => locked('presence', async transaction => {
      const time = now()
      await query(transaction, 'DELETE dbo.ActiveSessions WHERE Scope=@scope AND LastSeen<=@cutoff', { cutoff: time - ttlMs })
      const result = await query(transaction, `SELECT Platform FROM dbo.ActiveSessions WHERE Scope=@scope AND SessionId=@id;
        SELECT COUNT(*) AS total FROM dbo.ActiveSessions WHERE Scope=@scope;`, { id: sessionId })
      const previous = result.recordsets[0][0]
      if (previous && previous.Platform !== platform) throw Error('platform_conflict')
      if (!previous && result.recordsets[1][0].total >= maxSessions) throw Error('capacity')
      await query(transaction, `UPDATE dbo.ActiveSessions SET LastSeen=@time WHERE Scope=@scope AND SessionId=@id;
        IF @@ROWCOUNT=0 INSERT dbo.ActiveSessions(Scope,SessionId,Platform,LastSeen) VALUES(@scope,@id,@platform,@time);`, { id: sessionId, platform, time })
    }),
    end: async sessionId => { const { pool } = await connect(); await query(pool, 'DELETE dbo.ActiveSessions WHERE Scope=@scope AND SessionId=@id', { id: sessionId }) },
    prune: async () => { const { pool } = await connect(); await query(pool, 'DELETE dbo.ActiveSessions WHERE Scope=@scope AND LastSeen<=@cutoff', { cutoff: now() - ttlMs }) },
    snapshot: async () => {
      const { pool } = await connect(), time = now()
      // Đếm trực tiếp SQL, không biến lỗi database thành thống kê bằng 0.
      const result = await query(pool, `SELECT COUNT(*) AS active,
        COALESCE(SUM(CASE WHEN Platform='web' THEN 1 ELSE 0 END),0) AS web,
        COALESCE(SUM(CASE WHEN Platform='mobile-app' THEN 1 ELSE 0 END),0) AS mobile
        FROM dbo.ActiveSessions WHERE Scope=@scope AND LastSeen>@cutoff`, { cutoff: time - ttlMs })
      return { ...result.recordset[0], updatedAt: time, ttlSeconds: ttlMs / 1000 }
    },
  }
}
module.exports = { createSqlRepository }
