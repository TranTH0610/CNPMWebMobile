"""FILE NÀY LÀM GÌ: Tạo giọng đọc demo VI/EN/CN/PT/JA để thử audio thật.
Chỉ chạy khi chuẩn bị dữ liệu demo; không dịch hoặc tạo bài lịch sử cho du khách.
Phụ thuộc edge-tts; file MP3 được chép vào web/static và mobile/assets.
"""
import asyncio
from pathlib import Path
import edge_tts

ROOT = Path(__file__).resolve().parents[1]
SAMPLES = {
    'vi': ('vi-VN-HoaiMyNeural', 'Đây là nội dung minh họa để kiểm tra màn đọc thuyết minh. Trước khi phục vụ du khách, quản lý phải cung cấp, kiểm duyệt và công bố bài chính thức.'),
    'en': ('en-US-JennyNeural', 'This is sample text for testing the reading screen. Before serving visitors, management must provide, review and publish the official narration.'),
    'cn': ('zh-CN-XiaoxiaoNeural', '此文本仅用于测试讲解阅读页面。正式服务游客前，管理人员必须提供、审核并发布正式讲解。'),
    'pt': ('pt-PT-RaquelNeural', 'Este texto serve para testar a leitura. Antes de servir visitantes, a gestão deve fornecer, rever e publicar a narração oficial.'),
    'ja': ('ja-JP-NanamiNeural', 'これは解説の閲覧画面を確認するサンプルです。実際の公開前に管理者が正式な内容を提供、審査、公開する必要があります。'),
}

async def create(code, voice, text):
    folder = ROOT / 'apps/web/static/demo-audio'
    folder.mkdir(parents=True, exist_ok=True)
    file = folder / (code + '.mp3')
    await edge_tts.Communicate(text, voice, rate='-10%').save(str(file))
    native = ROOT / 'apps/mobile/assets/demo-audio'
    native.mkdir(parents=True, exist_ok=True)
    (native / file.name).write_bytes(file.read_bytes())
    print(code, file.stat().st_size)

async def main():
    await asyncio.gather(*(create(code, *value) for code, value in SAMPLES.items()))

asyncio.run(main())
