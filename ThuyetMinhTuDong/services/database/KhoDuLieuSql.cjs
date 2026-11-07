/**
 * CHỨC NĂNG: [DATABASE]
 * VAI TRÒ: TRUY CẬP SQL SERVER
 *
 * FILE NÀY LÀM GÌ:
 * Điều phối đọc/ghi SQL trong transaction; cung cấp dữ liệu di tích, QR và phiên hoạt động cho API.
 *
 * VỊ TRÍ: services/database/KhoDuLieuSql.cjs
 *
 * ĐƯỢC DÙNG BỞI:
 * - services/catalog/MayChuApi.cjs
 * - services/database/HoTroKiemThuDatabase.cjs
 * - services/database/NhapDuLieuKhoiTao.cjs
 * - services/presence/KiemThuPhienHoatDong.test.cjs
 * - services/presence/MayChuApi.cjs
 *
 * PHỤ THUỘC:
 * - ./KetNoiSqlServer.cjs
 * - ./AnhXaMuoiMotBang.cjs
 *
 * CÁC KHỐI CHÍNH:
 * 1. createSqlRepository
 *
 * MUỐN TÌM CODE: Ctrl+Shift+F tìm mã chức năng; Ctrl+Shift+O tìm hàm.
 * TẠI SAO TÁCH FILE: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
 */
const { connect } = require('./KetNoiSqlServer.cjs')
const { readDocument, writeDocument } = require('./AnhXaMuoiMotBang.cjs')
// ==================== [DATABASE] createSqlRepository ====================
// CHỨC NĂNG: Thực hiện bước createSqlRepository trong nhiệm vụ: Điều phối đọc/ghi SQL trong transaction; cung cấp dữ liệu di tích, QR và phiên hoạt động cho API.
// XỬ LÝ: Các nhánh kiểm tra, giá trị trả về và tác vụ nằm trong thân hàm dưới đây.
// TẠI SAO: Tách truy vấn và lưu trữ khỏi giao diện, dùng chung dữ liệu cho web/mobile.
// ==================== [DATABASE] createSqlRepository ====================
// CHỨC NĂNG: Tạo bộ thao tác di tích, lượt QR và phiên hoạt động sử dụng SQL.
// XỬ LÝ: Nhận scope, đồng hồ và giới hạn; trả các hàm mà API gọi.
// TẠI SAO: Web và mobile cùng đọc/ghi một nguồn dữ liệu thông qua API.
function createSqlRepository({
  scope = 'main',
  now = Date.now,
  ttlMs = 90000,
  maxSessions = 10000,
} = {}) {
  const dayOf = () =>
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(now()))
  // ==================== [DATABASE] query ====================
  // CHỨC NĂNG: Thực hiện truy vấn với kiểu tham số đang được repository sử dụng.
  // XỬ LÝ: Lấy driver từ kết nối; bind số và chuỗi bằng request.input trước khi query.
  // TẠI SAO: Không nối giá trị người dùng trực tiếp vào câu lệnh SQL.
  async function query(executor, text, values = {}) {
    const { sql } = await connect(scope),
      request = executor.request()
    for (const [k, v] of Object.entries(values))
      request.input(k, typeof v === 'number' ? sql.BigInt : sql.NVarChar(sql.MAX), v)
    return request.query(text)
  }
  // ==================== [DATABASE] locked ====================
  // CHỨC NĂNG: Chạy một tác vụ dưới transaction và khóa tài nguyên SQL.
  // XỬ LÝ: Mở transaction, xin sp_getapplock, commit nếu thành công; rollback nếu lỗi.
  // TẠI SAO: Các thao tác cạnh tranh được điều phối để hạn chế ghi đè và ghi một phần dữ liệu.
  async function locked(resource, action, mode = 'Exclusive') {
    const { sql, pool } = await connect(scope),
      transaction = new sql.Transaction(pool)
    await transaction.begin(sql.ISOLATION_LEVEL.READ_COMMITTED)
    try {
      await query(
        transaction,
        `DECLARE @r int;EXEC @r=sys.sp_getapplock @Resource=@resource,@LockMode=@mode,@LockOwner='Transaction',@LockTimeout=10000;IF @r<0 THROW 51000,'database_busy',1;`,
        { resource: 'HueGuide11:' + resource, mode },
      )
      const result = await action(transaction)
      await transaction.commit()
      return result
    } catch (error) {
      try {
        await transaction.rollback()
      } catch {
        // Transaction có thể đã bị SQL hủy; không để lỗi rollback che mất lỗi nghiệp vụ gốc.
      }
      throw error
    }
  }
  // CHỨC NĂNG: Đọc dùng Shared, ghi dùng Exclusive trên cùng tài nguyên khóa.
  // TẠI SAO: Các lượt đọc chạy đồng thời, nhưng không nhìn thấy transaction ghi đang dở.
  async function catalog(action, readOnly = false) {
    return locked(
      'catalog',
      async (transaction) => {
        const { sql } = await connect(scope)
        let loaded = false,
          cached
        return action({
          read: async () => {
            // CHỨC NĂNG: Chỉ đọc SQL một lần trong một request; không lưu dữ liệu nghiệp vụ giữa các request.
            if (!loaded) {
              const state = await query(
                transaction,
                "SELECT last_used_value AS current_value FROM sys.sequences WHERE name=N'SeqDiTich'",
              )
              const document = await readDocument(transaction)
              cached =
                !document.places.length && state.recordset[0]?.current_value === null
                  ? null
                  : JSON.stringify(document)
              loaded = true
            }
            return cached
          },
          write: async (payload) => {
            if (readOnly) throw Error('read_only_catalog')
            if (Buffer.byteLength(payload) > 32 * 1024 * 1024) throw Error('capacity')
            await writeDocument(transaction, sql, scope, JSON.parse(payload))
            loaded = false
          },
        })
      },
      readOnly ? 'Shared' : 'Exclusive',
    )
  }
  return {
    catalog: (action) => catalog(action),
    catalogRead: (action) => catalog(action, true),
    version: async () => {
      const { pool } = await connect(scope)
      const result = await query(
        pool,
        `SELECT CONVERT(varchar(64),HASHBYTES('SHA2_256',CONCAT(
    (SELECT * FROM dbo.DiTich ORDER BY MaDiTich FOR JSON PATH),
    (SELECT * FROM dbo.BanDiTich ORDER BY MaBanDiTich FOR JSON PATH),
    (SELECT * FROM dbo.NoiDungDiTich ORDER BY MaNoiDung FOR JSON PATH),
    (SELECT * FROM dbo.HinhAnhDiTich ORDER BY MaHinhAnh FOR JSON PATH),
    (SELECT * FROM dbo.BanThuThuyetMinh ORDER BY MaBanThu FOR JSON PATH),
    (SELECT * FROM dbo.NguonThamKhao ORDER BY MaNguon FOR JSON PATH))),2) AS version`,
      )
      return result.recordset[0].version
    },
    // ==================== [THONG-KE] gateStatistics ====================
    // CHỨC NĂNG: Tính tổng lượt QR của ngày hiện tại.
    // XỬ LÝ: Cộng SoLuot của LuotTruyCapQR theo ngày do dayOf trả về.
    // TẠI SAO: Giữ cách tính theo ngày Việt Nam và đọc số liệu từ database chung.
    gateStatistics: async () => {
      const { pool } = await connect(scope),
        day = dayOf()
      const r = await query(
        pool,
        'SELECT COALESCE(SUM(CONVERT(bigint,SoLuot)),0) AS today FROM dbo.LuotTruyCapQR WHERE NgayTruyCap=CONVERT(date,@day)',
        { day },
      )
      return { today: Number(r.recordset[0].today), day }
    },
    // ==================== [TRUY-CAP-QR] gateEntry ====================
    // CHỨC NĂNG: Ghi nhận lượt truy cập QR và bỏ qua lượt trùng trong ngày.
    // XỬ LÝ: Khóa tài nguyên gate, kiểm tra ngày + mã lượt; chưa có mới INSERT một lượt.
    // TẠI SAO: Nhiều request đồng thời hoặc mở lại cùng phiên không tự làm tăng trùng.
    gateEntry: (visitId, platform) =>
      locked('gate', async (transaction) => {
        const day = dayOf(),
          r = await query(
            transaction,
            `SELECT COUNT(*) AS total FROM dbo.LuotTruyCapQR WHERE NgayTruyCap=CONVERT(date,@day) AND LoaiGhiNhan='luot_moi';SELECT 1 AS found FROM dbo.LuotTruyCapQR WHERE NgayTruyCap=CONVERT(date,@day) AND MaLuotTruyCap=@visitId;`,
            { day, visitId },
          )
        if (r.recordsets[1].length) return
        if (r.recordsets[0][0].total >= 50000) throw Error('capacity')
        await query(
          transaction,
          `INSERT dbo.LuotTruyCapQR(NgayTruyCap,MaLuotTruyCap,NenTang,ThoiDiemTruyCap,LoaiGhiNhan,SoLuot) VALUES(CONVERT(date,@day),@visitId,@platform,SYSUTCDATETIME(),'luot_moi',1)`,
          { day, visitId, platform },
        )
      }),
    importGate: (gate) =>
      locked('gate', async (transaction) => {
        if (
          !gate ||
          !/^\d{4}-\d{2}-\d{2}$/.test(gate.day) ||
          !Number.isSafeInteger(gate.today) ||
          gate.today < 0
        )
          throw Error('invalid_gate')
        await query(
          transaction,
          `IF NOT EXISTS(SELECT 1 FROM dbo.LuotTruyCapQR WHERE NgayTruyCap=CONVERT(date,@day)) INSERT dbo.LuotTruyCapQR(NgayTruyCap,MaLuotTruyCap,NenTang,ThoiDiemTruyCap,LoaiGhiNhan,SoLuot) VALUES(CONVERT(date,@day),CONCAT('chuyen-cu-',@day),NULL,NULL,'tong_chuyen_cu',@total)`,
          { day: gate.day, total: gate.today },
        )
      }),
    // ==================== [PHIEN-HOAT-DONG] heartbeat ====================
    // CHỨC NĂNG: Ghi tín hiệu hoạt động mới nhất của một phiên.
    // XỬ LÝ: Dọn phiên hết hạn, kiểm tra nền tảng/giới hạn rồi cập nhật hoặc thêm phiên.
    // TẠI SAO: Một phiên gửi nhiều heartbeat vẫn là một phiên đang hoạt động.
    heartbeat: ({ sessionId, platform }) =>
      locked('presence', async (transaction) => {
        const time = now(),
          cutoff = new Date(time - ttlMs).toISOString()
        await query(
          transaction,
          'DELETE dbo.PhienHoatDong WHERE ThoiDiemHoatDongCuoi<=CONVERT(datetime2,@cutoff,127)',
          { cutoff },
        )
        const r = await query(
          transaction,
          'SELECT NenTang FROM dbo.PhienHoatDong WHERE MaPhien=@id;SELECT COUNT(*) AS total FROM dbo.PhienHoatDong',
          { id: sessionId },
        )
        if (r.recordsets[0][0] && r.recordsets[0][0].NenTang !== platform)
          throw Error('platform_conflict')
        if (!r.recordsets[0].length && r.recordsets[1][0].total >= maxSessions)
          throw Error('capacity')
        await query(
          transaction,
          `UPDATE dbo.PhienHoatDong SET ThoiDiemHoatDongCuoi=CONVERT(datetime2,@time,127) WHERE MaPhien=@id;IF @@ROWCOUNT=0 INSERT dbo.PhienHoatDong VALUES(@id,@platform,CONVERT(datetime2,@time,127))`,
          { id: sessionId, platform, time: new Date(time).toISOString() },
        )
      }),
    // ==================== [PHIEN-HOAT-DONG] end ====================
    // CHỨC NĂNG: Kết thúc một phiên đang được theo dõi.
    // XỬ LÝ: Xóa hàng có MaPhien tương ứng bằng tham số SQL.
    // TẠI SAO: Chỉ ảnh hưởng phiên được yêu cầu và có thể gọi lại an toàn.
    end: async (id) => {
      const { pool } = await connect(scope)
      await query(pool, 'DELETE dbo.PhienHoatDong WHERE MaPhien=@id', { id })
    },
    // ==================== [PHIEN-HOAT-DONG] prune ====================
    // CHỨC NĂNG: Dọn các phiên đã quá hạn hoạt động.
    // XỬ LÝ: Xóa hàng có thời điểm hoạt động nhỏ hơn hoặc bằng mốc TTL.
    // TẠI SAO: Giữ bảng theo dõi gọn và tránh giữ phiên đã rời hệ thống.
    prune: async () => {
      const { pool } = await connect(scope)
      await query(
        pool,
        'DELETE dbo.PhienHoatDong WHERE ThoiDiemHoatDongCuoi<=CONVERT(datetime2,@cutoff,127)',
        { cutoff: new Date(now() - ttlMs).toISOString() },
      )
    },
    // ==================== [THONG-KE] snapshot ====================
    // CHỨC NĂNG: Đếm phiên còn hoạt động, chia web và mobile.
    // XỬ LÝ: Chỉ COUNT các phiên có thời điểm hoạt động mới hơn mốc TTL.
    // TẠI SAO: Phiên đã quá hạn không tiếp tục được tính như du khách còn đang sử dụng.
    snapshot: async () => {
      const { pool } = await connect(scope),
        time = now()
      const r = await query(
        pool,
        `SELECT COUNT(*) AS active,COALESCE(SUM(CASE WHEN NenTang='web' THEN 1 ELSE 0 END),0) AS web,COALESCE(SUM(CASE WHEN NenTang='mobile-app' THEN 1 ELSE 0 END),0) AS mobile FROM dbo.PhienHoatDong WHERE ThoiDiemHoatDongCuoi>CONVERT(datetime2,@cutoff,127)`,
        { cutoff: new Date(time - ttlMs).toISOString() },
      )
      return { ...r.recordset[0], updatedAt: time, ttlSeconds: ttlMs / 1000 }
    },
  }
}
module.exports = { createSqlRepository }
