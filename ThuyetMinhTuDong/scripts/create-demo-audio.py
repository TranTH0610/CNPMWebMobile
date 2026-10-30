# FILE NÀY LÀM GÌ
# Script cũ tạo các đoạn giọng mẫu ngắn theo ngôn ngữ; khác với quy trình sinh đầy đủ bài di tích
# trong generate-narrations.py.
#
# VỊ TRÍ: scripts/create-demo-audio.py
# DÙNG BỞI: Lệnh npm hoặc script gọi tệp này; xem package.json và import/require bên dưới.

"""FILE NÀY LÀM GÌ: Tạo giọng đọc demo VI/EN/CN/PT/JA để thử audio thật.
Chỉ chạy khi chuẩn bị dữ liệu demo; không dịch hoặc tạo bài lịch sử cho du khách.
Phụ thuộc edge-tts; file MP3 được chép vào web/static và mobile/assets.
"""
# DÒNG BÊN DƯỚI: Nhập module/thành phần import asyncio; dùng thư viện sẵn có cho xử lý tệp, dữ liệu hoặc âm thanh.
import asyncio
# DÒNG BÊN DƯỚI: Nhập module/thành phần from pathlib import Path; dùng thư viện sẵn có cho xử lý tệp, dữ liệu hoặc âm thanh.
from pathlib import Path
# DÒNG BÊN DƯỚI: Nhập module/thành phần import edge_tts; dùng thư viện sẵn có cho xử lý tệp, dữ liệu hoặc âm thanh.
import edge_tts

# DÒNG BÊN DƯỚI: Thực hiện `ROOT = Path(__file__).resolve().parents[1]`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
ROOT = Path(__file__).resolve().parents[1]
# DÒNG BÊN DƯỚI: Thực hiện `SAMPLES = {`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
SAMPLES = {
    # DÒNG BÊN DƯỚI: Thực hiện `'vi': ('vi-VN-HoaiMyNeural', 'Đây là nội dung minh họa để kiểm tra màn đọc thuyết minh. Trước khi phục vụ du khách, quản lý phải cung cấp, kiểm duyệt `; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    'vi': ('vi-VN-HoaiMyNeural', 'Đây là nội dung minh họa để kiểm tra màn đọc thuyết minh. Trước khi phục vụ du khách, quản lý phải cung cấp, kiểm duyệt và công bố bài chính thức.'),
    # DÒNG BÊN DƯỚI: Thực hiện `'en': ('en-US-JennyNeural', 'This is sample text for testing the reading screen. Before serving visitors, management must provide, review and publish `; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    'en': ('en-US-JennyNeural', 'This is sample text for testing the reading screen. Before serving visitors, management must provide, review and publish the official narration.'),
    # DÒNG BÊN DƯỚI: Thực hiện `'cn': ('zh-CN-XiaoxiaoNeural', '此文本仅用于测试讲解阅读页面。正式服务游客前，管理人员必须提供、审核并发布正式讲解。'),`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    'cn': ('zh-CN-XiaoxiaoNeural', '此文本仅用于测试讲解阅读页面。正式服务游客前，管理人员必须提供、审核并发布正式讲解。'),
    # DÒNG BÊN DƯỚI: Thực hiện `'pt': ('pt-PT-RaquelNeural', 'Este texto serve para testar a leitura. Antes de servir visitantes, a gestão deve fornecer, rever e publicar a narração `; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    'pt': ('pt-PT-RaquelNeural', 'Este texto serve para testar a leitura. Antes de servir visitantes, a gestão deve fornecer, rever e publicar a narração oficial.'),
    # DÒNG BÊN DƯỚI: Thực hiện `'ja': ('ja-JP-NanamiNeural', 'これは解説の閲覧画面を確認するサンプルです。実際の公開前に管理者が正式な内容を提供、審査、公開する必要があります。'),`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    'ja': ('ja-JP-NanamiNeural', 'これは解説の閲覧画面を確認するサンプルです。実際の公開前に管理者が正式な内容を提供、審査、公開する必要があります。'),
# DÒNG BÊN DƯỚI: Khép/mở nhóm cú pháp Python; xác định phạm vi biểu thức dữ liệu đang xây dựng.
}

# DÒNG BÊN DƯỚI: Khai báo hàm async def create(code, voice, text):; nhận tham số và gom các bước để nơi gọi dùng lại.
async def create(code, voice, text):
    # DÒNG BÊN DƯỚI: Thực hiện `folder = ROOT / 'apps/web/static/demo-audio'`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    folder = ROOT / 'apps/web/static/demo-audio'
    # DÒNG BÊN DƯỚI: Thực hiện `folder.mkdir(parents=True, exist_ok=True)`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    folder.mkdir(parents=True, exist_ok=True)
    # DÒNG BÊN DƯỚI: Thực hiện `file = folder / (code + '.mp3')`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    file = folder / (code + '.mp3')
    # DÒNG BÊN DƯỚI: Ghi dữ liệu/tệp tại await edge_tts.Communicate(text, voice, rate='-10%').save(str(file)); vị trí và encoding/định dạng được chỉ rõ trong lời gọi.
    await edge_tts.Communicate(text, voice, rate='-10%').save(str(file))
    # DÒNG BÊN DƯỚI: Thực hiện `native = ROOT / 'apps/mobile/assets/demo-audio'`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    native = ROOT / 'apps/mobile/assets/demo-audio'
    # DÒNG BÊN DƯỚI: Thực hiện `native.mkdir(parents=True, exist_ok=True)`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    native.mkdir(parents=True, exist_ok=True)
    # DÒNG BÊN DƯỚI: Ghi dữ liệu/tệp tại (native / file.name).write_bytes(file.read_bytes()); vị trí và encoding/định dạng được chỉ rõ trong lời gọi.
    (native / file.name).write_bytes(file.read_bytes())
    # DÒNG BÊN DƯỚI: In tiến độ/kết quả ra terminal để theo dõi script; không thay đổi giao diện ứng dụng.
    print(code, file.stat().st_size)

# DÒNG BÊN DƯỚI: Khai báo hàm async def main():; nhận tham số và gom các bước để nơi gọi dùng lại.
async def main():
    # DÒNG BÊN DƯỚI: Thực hiện `await asyncio.gather(*(create(code, *value) for code, value in SAMPLES.items()))`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    await asyncio.gather(*(create(code, *value) for code, value in SAMPLES.items()))

# DÒNG BÊN DƯỚI: Thực hiện `asyncio.run(main())`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
asyncio.run(main())

# TẠI SAO TÁCH FILE: Các bước chạy demo được tập trung trong công cụ để các máy thực hiện cùng
# quy trình.
