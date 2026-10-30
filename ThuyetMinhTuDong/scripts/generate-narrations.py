# FILE NÀY LÀM GÌ
# Sinh MP3 từ body của từng di tích/ngôn ngữ; ghi manifest và bản sao web/native tương ứng.
#
# VỊ TRÍ: scripts/generate-narrations.py
# DÙNG BỞI: Lệnh npm hoặc script gọi tệp này; xem package.json và import/require bên dưới.

"""FILE NÀY LÀM GÌ: Tạo MP3 từ đúng body trong heritageContent.json cho web/mobile.
Chạy thủ công khi thay bài nguồn; phụ thuộc requirements-narration.txt. UC06, UC14.2.
Không dịch tự động, không dùng âm thanh mẫu để thay cho bài mới.
"""
# DÒNG BÊN DƯỚI: Nhập module/thành phần import argparse; dùng thư viện sẵn có cho xử lý tệp, dữ liệu hoặc âm thanh.
import argparse
# DÒNG BÊN DƯỚI: Nhập module/thành phần import hashlib; dùng thư viện sẵn có cho xử lý tệp, dữ liệu hoặc âm thanh.
import hashlib
# DÒNG BÊN DƯỚI: Nhập module/thành phần import json; dùng thư viện sẵn có cho xử lý tệp, dữ liệu hoặc âm thanh.
import json
# DÒNG BÊN DƯỚI: Nhập module/thành phần import time; dùng thư viện sẵn có cho xử lý tệp, dữ liệu hoặc âm thanh.
import time
# DÒNG BÊN DƯỚI: Nhập module/thành phần from concurrent.futures import ThreadPoolExecutor; dùng thư viện sẵn có cho xử lý tệp, dữ liệu hoặc âm thanh.
from concurrent.futures import ThreadPoolExecutor
# DÒNG BÊN DƯỚI: Nhập module/thành phần from pathlib import Path; dùng thư viện sẵn có cho xử lý tệp, dữ liệu hoặc âm thanh.
from pathlib import Path
# DÒNG BÊN DƯỚI: Nhập module/thành phần from gtts import gTTS; dùng thư viện sẵn có cho xử lý tệp, dữ liệu hoặc âm thanh.
from gtts import gTTS
# DÒNG BÊN DƯỚI: Nhập module/thành phần from mutagen.mp3 import MP3; dùng thư viện sẵn có cho xử lý tệp, dữ liệu hoặc âm thanh.
from mutagen.mp3 import MP3

# DÒNG BÊN DƯỚI: Thực hiện `ROOT = Path(__file__).resolve().parent.parent`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
ROOT = Path(__file__).resolve().parent.parent
# DÒNG BÊN DƯỚI: Thực hiện `LANGUAGES = {"vi": ("vi", "com"), "en": ("en", "com"), "cn": ("zh-CN", "com"), "pt": ("pt", "pt"), "ja": ("ja", "com")}`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
LANGUAGES = {"vi": ("vi", "com"), "en": ("en", "com"), "cn": ("zh-CN", "com"), "pt": ("pt", "pt"), "ja": ("ja", "com")}

# DÒNG BÊN DƯỚI: Khai báo hàm def synthesize(body, language, destination):; nhận tham số và gom các bước để nơi gọi dùng lại.
def synthesize(body, language, destination):
    # CHỨC NĂNG: Đọc đúng văn bản được lưu, không thêm lời giới thiệu khác bài.
    # XỬ LÝ: Mỗi tác vụ có timeout và tối đa ba lần thử. Tệp tạm chỉ thay tệp
    # chính sau khi MP3 có thời lượng hợp lệ; mất mạng không để lại MP3 rỗng.
    # DÒNG BÊN DƯỚI: Thực hiện `code, tld = LANGUAGES[language]`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    code, tld = LANGUAGES[language]
    # DÒNG BÊN DƯỚI: Thực hiện `temporary = destination.with_suffix(".tmp.mp3")`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    temporary = destination.with_suffix(".tmp.mp3")
    # DÒNG BÊN DƯỚI: Lặp theo for attempt in range(3):; áp dụng cùng xử lý cho từng phần tử/tác vụ.
    for attempt in range(3):
        # DÒNG BÊN DƯỚI: Xử lý vùng lỗi try:; cho phép thử lại hoặc dọn tệp tạm khi tạo audio thất bại.
        try:
            # DÒNG BÊN DƯỚI: Ghi dữ liệu/tệp tại gTTS(body, lang=code, tld=tld, timeout=(10, 35)).save(str(temporary)); vị trí và encoding/định dạng được chỉ rõ trong lời gọi.
            gTTS(body, lang=code, tld=tld, timeout=(10, 35)).save(str(temporary))
            # DÒNG BÊN DƯỚI: Thực hiện `duration = MP3(temporary).info.length`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
            duration = MP3(temporary).info.length
            # DÒNG BÊN DƯỚI: Chọn nhánh theo if duration < 1:; chỉ chạy phần thân khi điều kiện tương ứng được chọn.
            if duration < 1:
                # DÒNG BÊN DƯỚI: Báo lỗi tại raise ValueError("MP3 quá ngắn"); không báo hoàn tất khi audio/tác vụ chưa hợp lệ.
                raise ValueError("MP3 quá ngắn")
            # DÒNG BÊN DƯỚI: Thay tệp đích bằng tệp đã tạo thành công ở bước này; không để kết quả dở dang trở thành bản thu chính.
            temporary.replace(destination)
            # DÒNG BÊN DƯỚI: Trả kết quả của nhánh hiện tại về nơi gọi; không chạy tiếp các bước sau return trong hàm.
            return duration
        # DÒNG BÊN DƯỚI: Xử lý vùng lỗi except Exception:; cho phép thử lại hoặc dọn tệp tạm khi tạo audio thất bại.
        except Exception:
            # DÒNG BÊN DƯỚI: Xóa tệp tạm theo đường dẫn này để lần thử sau không dùng kết quả lỗi hoặc MP3 dở dang.
            temporary.unlink(missing_ok=True)
            # DÒNG BÊN DƯỚI: Chọn nhánh theo if attempt == 2:; chỉ chạy phần thân khi điều kiện tương ứng được chọn.
            if attempt == 2:
                # DÒNG BÊN DƯỚI: Báo lỗi tại raise; không báo hoàn tất khi audio/tác vụ chưa hợp lệ.
                raise
            # DÒNG BÊN DƯỚI: Chờ giữa các lần thử để không gửi dồn tác vụ ra dịch vụ âm thanh khi đang lỗi.
            time.sleep(attempt + 1)

# DÒNG BÊN DƯỚI: Khai báo hàm def main():; nhận tham số và gom các bước để nơi gọi dùng lại.
def main():
    # DÒNG BÊN DƯỚI: Thực hiện `parser = argparse.ArgumentParser()`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    parser = argparse.ArgumentParser()
    # DÒNG BÊN DƯỚI: Thực hiện `parser.add_argument("--request", help="JSON {body,language} cho server RAM")`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    parser.add_argument("--request", help="JSON {body,language} cho server RAM")
    # DÒNG BÊN DƯỚI: Thực hiện `parser.add_argument("--output", help="Tệp MP3 đích của server RAM")`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    parser.add_argument("--output", help="Tệp MP3 đích của server RAM")
    # DÒNG BÊN DƯỚI: Thực hiện `args = parser.parse_args()`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    args = parser.parse_args()
    # DÒNG BÊN DƯỚI: Chọn nhánh theo if args.request:; chỉ chạy phần thân khi điều kiện tương ứng được chọn.
    if args.request:
        # DÒNG BÊN DƯỚI: Thực hiện `request = json.loads(Path(args.request).read_text(encoding="utf-8"))`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
        request = json.loads(Path(args.request).read_text(encoding="utf-8"))
        # DÒNG BÊN DƯỚI: Thực hiện `destination = Path(args.output)`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
        destination = Path(args.output)
        # DÒNG BÊN DƯỚI: Thực hiện `destination.parent.mkdir(parents=True, exist_ok=True)`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
        destination.parent.mkdir(parents=True, exist_ok=True)
        # DÒNG BÊN DƯỚI: Tạo bản đọc từ body/ngôn ngữ và ghi ra đích theo lời gọi; không dùng một âm thanh mẫu cho tất cả nội dung.
        synthesize(request["body"], request["language"], destination)
        # DÒNG BÊN DƯỚI: Trả kết quả của nhánh hiện tại về nơi gọi; không chạy tiếp các bước sau return trong hàm.
        return
    # DÒNG BÊN DƯỚI: Thực hiện `entries = json.loads((ROOT / "packages/visitor-core/src/data/heritageContent.json").read_text(encoding="utf-8"))`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    entries = json.loads((ROOT / "packages/visitor-core/src/data/heritageContent.json").read_text(encoding="utf-8"))
    # DÒNG BÊN DƯỚI: Thực hiện `web = ROOT / "apps/web/static/narrations"`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    web = ROOT / "apps/web/static/narrations"
    # DÒNG BÊN DƯỚI: Thực hiện `mobile = ROOT / "apps/mobile/assets/narrations"`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    mobile = ROOT / "apps/mobile/assets/narrations"
    # DÒNG BÊN DƯỚI: Thực hiện `web.mkdir(parents=True, exist_ok=True)`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    web.mkdir(parents=True, exist_ok=True)
    # DÒNG BÊN DƯỚI: Thực hiện `mobile.mkdir(parents=True, exist_ok=True)`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    mobile.mkdir(parents=True, exist_ok=True)
    # DÒNG BÊN DƯỚI: Thực hiện `jobs = [(entry["id"], lang, text["body"]) for entry in entries for lang, text in entry["content"].items()]`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    jobs = [(entry["id"], lang, text["body"]) for entry in entries for lang, text in entry["content"].items()]
    # DÒNG BÊN DƯỚI: Khai báo hàm def generate(job):; nhận tham số và gom các bước để nơi gọi dùng lại.
    def generate(job):
        # DÒNG BÊN DƯỚI: Thực hiện `id, lang, body = job`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
        id, lang, body = job
        # DÒNG BÊN DƯỚI: Tạo dấu vân tay từ đúng dữ liệu văn bản/ngôn ngữ để nhận diện nội dung và tra bản thu tương ứng.
        text_hash = hashlib.sha256(body.encode("utf-8")).hexdigest()
        # DÒNG BÊN DƯỚI: Tạo dấu vân tay từ đúng dữ liệu văn bản/ngôn ngữ để nhận diện nội dung và tra bản thu tương ứng.
        key = hashlib.sha256(("gtts-v1|" + lang + "|" + body).encode("utf-8")).hexdigest()
        # DÒNG BÊN DƯỚI: Thực hiện `target = web / (key + ".mp3")`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
        target = web / (key + ".mp3")
        # DÒNG BÊN DƯỚI: Tạo bản đọc từ body/ngôn ngữ và ghi ra đích theo lời gọi; không dùng một âm thanh mẫu cho tất cả nội dung.
        duration = MP3(target).info.length if target.exists() and target.stat().st_size > 0 else synthesize(body, lang, target)
        # DÒNG BÊN DƯỚI: Ghi dữ liệu/tệp tại (mobile / target.name).write_bytes(target.read_bytes()); vị trí và encoding/định dạng được chỉ rõ trong lời gọi.
        (mobile / target.name).write_bytes(target.read_bytes())
        # DÒNG BÊN DƯỚI: In tiến độ/kết quả ra terminal để theo dõi script; không thay đổi giao diện ứng dụng.
        print(id, lang, round(duration, 2), "seconds", flush=True)
        # DÒNG BÊN DƯỚI: Trả kết quả của nhánh hiện tại về nơi gọi; không chạy tiếp các bước sau return trong hàm.
        return {"placeId": id, "language": lang, "key": key, "textSha256": text_hash, "audioSha256": hashlib.sha256(target.read_bytes()).hexdigest(), "duration": round(duration, 3), "bytes": target.stat().st_size, "provider": "gTTS", "speechLanguage": LANGUAGES[lang][0]}
    # CHỨC NĂNG: Giới hạn bốn kết nối; chỉ ghi manifest sau khi đủ 40 bài.
    # DÒNG BÊN DƯỚI: Quản lý phạm vi tài nguyên with ThreadPoolExecutor(max_workers=4) as pool:; thoát khối sẽ kết thúc ngữ cảnh theo hợp đồng của thư viện.
    with ThreadPoolExecutor(max_workers=4) as pool:
        # DÒNG BÊN DƯỚI: Thực hiện `records = list(pool.map(generate, jobs))`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
        records = list(pool.map(generate, jobs))
    # DÒNG BÊN DƯỚI: Ghi dữ liệu/tệp tại (ROOT / "packages/visitor-core/src/data/narrations.json").write_text(json.dumps(records, ensure_ascii=False, indent=2) +; vị trí và encoding/định dạng được chỉ rõ trong lời gọi.
    (ROOT / "packages/visitor-core/src/data/narrations.json").write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    # DÒNG BÊN DƯỚI: Thực hiện `lines = ["/** FILE NÀY LÀM GÌ: Ánh xạ MP3 tĩnh để Metro đóng gói đúng 40 bản đọc.", " * generate-narrations.py sinh; journeyAdapters và AudioPreview d`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    lines = ["/** FILE NÀY LÀM GÌ: Ánh xạ MP3 tĩnh để Metro đóng gói đúng 40 bản đọc.", " * generate-narrations.py sinh; journeyAdapters và AudioPreview dùng. Không sửa tay. */"]
    # DÒNG BÊN DƯỚI: Lặp theo for index, record in enumerate(records):; áp dụng cùng xử lý cho từng phần tử/tác vụ.
    for index, record in enumerate(records):
        # DÒNG BÊN DƯỚI: Thực hiện `lines.append(f"import audio{index} from '../../assets/narrations/{record['key']}.mp3'")`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
        lines.append(f"import audio{index} from '../../assets/narrations/{record['key']}.mp3'")
    # DÒNG BÊN DƯỚI: Thực hiện `lines.extend(["// CHỨC NĂNG: Tra bằng dấu vân tay của văn bản/ngôn ngữ, tránh phát nhầm bài.", "export const narrationAssets: Readonly<Record<string, `; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    lines.extend(["// CHỨC NĂNG: Tra bằng dấu vân tay của văn bản/ngôn ngữ, tránh phát nhầm bài.", "export const narrationAssets: Readonly<Record<string, number>> = {"])
    # DÒNG BÊN DƯỚI: Thực hiện `lines.extend(f" '{record['key']}': audio{index}," for index, record in enumerate(records))`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    lines.extend(f"  '{record['key']}': audio{index}," for index, record in enumerate(records))
    # DÒNG BÊN DƯỚI: Thực hiện `lines.append("}\n")`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    lines.append("}\n")
    # DÒNG BÊN DƯỚI: Ghi dữ liệu/tệp tại (ROOT / "apps/mobile/src/services/narrationAssets.ts").write_text("\n".join(lines), encoding="utf-8"); vị trí và encoding/định dạng được chỉ rõ trong lời gọi.
    (ROOT / "apps/mobile/src/services/narrationAssets.ts").write_text("\n".join(lines), encoding="utf-8")

# DÒNG BÊN DƯỚI: Chọn nhánh theo if __name__ == "__main__":; chỉ chạy phần thân khi điều kiện tương ứng được chọn.
if __name__ == "__main__":
    # DÒNG BÊN DƯỚI: Thực hiện `main()`; biến/biểu thức giữ dữ liệu trung gian của bước tạo và ánh xạ bản thu, tên và đối số xác định nguồn/đích.
    main()

# TẠI SAO TÁCH FILE: Các bước chạy demo được tập trung trong công cụ để các máy thực hiện cùng
# quy trình.
