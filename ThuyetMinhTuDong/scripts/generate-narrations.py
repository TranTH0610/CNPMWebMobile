"""FILE NÀY LÀM GÌ: Tạo MP3 từ đúng body trong heritageContent.json cho web/mobile.
Chạy thủ công khi thay bài nguồn; phụ thuộc requirements-narration.txt. UC06, UC14.2.
Không dịch tự động, không dùng âm thanh mẫu để thay cho bài mới.
"""
import argparse
import hashlib
import json
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from gtts import gTTS
from mutagen.mp3 import MP3

ROOT = Path(__file__).resolve().parent.parent
LANGUAGES = {"vi": ("vi", "com"), "en": ("en", "com"), "cn": ("zh-CN", "com"), "pt": ("pt", "pt"), "ja": ("ja", "com")}

def synthesize(body, language, destination):
    # CHỨC NĂNG: Đọc đúng văn bản được lưu, không thêm lời giới thiệu khác bài.
    # XỬ LÝ: Mỗi tác vụ có timeout và tối đa ba lần thử. Tệp tạm chỉ thay tệp
    # chính sau khi MP3 có thời lượng hợp lệ; mất mạng không để lại MP3 rỗng.
    code, tld = LANGUAGES[language]
    temporary = destination.with_suffix(".tmp.mp3")
    for attempt in range(3):
        try:
            gTTS(body, lang=code, tld=tld, timeout=(10, 35)).save(str(temporary))
            duration = MP3(temporary).info.length
            if duration < 1:
                raise ValueError("MP3 quá ngắn")
            temporary.replace(destination)
            return duration
        except Exception:
            temporary.unlink(missing_ok=True)
            if attempt == 2:
                raise
            time.sleep(attempt + 1)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--request", help="JSON {body,language} cho server RAM")
    parser.add_argument("--output", help="Tệp MP3 đích của server RAM")
    args = parser.parse_args()
    if args.request:
        request = json.loads(Path(args.request).read_text(encoding="utf-8"))
        destination = Path(args.output)
        destination.parent.mkdir(parents=True, exist_ok=True)
        synthesize(request["body"], request["language"], destination)
        return
    entries = json.loads((ROOT / "packages/visitor-core/src/data/heritageContent.json").read_text(encoding="utf-8"))
    web = ROOT / "apps/web/static/narrations"
    mobile = ROOT / "apps/mobile/assets/narrations"
    web.mkdir(parents=True, exist_ok=True)
    mobile.mkdir(parents=True, exist_ok=True)
    jobs = [(entry["id"], lang, text["body"]) for entry in entries for lang, text in entry["content"].items()]
    def generate(job):
        id, lang, body = job
        text_hash = hashlib.sha256(body.encode("utf-8")).hexdigest()
        key = hashlib.sha256(("gtts-v1|" + lang + "|" + body).encode("utf-8")).hexdigest()
        target = web / (key + ".mp3")
        duration = MP3(target).info.length if target.exists() and target.stat().st_size > 0 else synthesize(body, lang, target)
        (mobile / target.name).write_bytes(target.read_bytes())
        print(id, lang, round(duration, 2), "seconds", flush=True)
        return {"placeId": id, "language": lang, "key": key, "textSha256": text_hash, "audioSha256": hashlib.sha256(target.read_bytes()).hexdigest(), "duration": round(duration, 3), "bytes": target.stat().st_size, "provider": "gTTS", "speechLanguage": LANGUAGES[lang][0]}
    # CHỨC NĂNG: Giới hạn bốn kết nối; chỉ ghi manifest sau khi đủ 40 bài.
    with ThreadPoolExecutor(max_workers=4) as pool:
        records = list(pool.map(generate, jobs))
    (ROOT / "packages/visitor-core/src/data/narrations.json").write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    lines = ["/** FILE NÀY LÀM GÌ: Ánh xạ MP3 tĩnh để Metro đóng gói đúng 40 bản đọc.", " * generate-narrations.py sinh; journeyAdapters và AudioPreview dùng. Không sửa tay. */"]
    for index, record in enumerate(records):
        lines.append(f"import audio{index} from '../../assets/narrations/{record['key']}.mp3'")
    lines.extend(["// CHỨC NĂNG: Tra bằng dấu vân tay của văn bản/ngôn ngữ, tránh phát nhầm bài.", "export const narrationAssets: Readonly<Record<string, number>> = {"])
    lines.extend(f"  '{record['key']}': audio{index}," for index, record in enumerate(records))
    lines.append("}\n")
    (ROOT / "apps/mobile/src/services/narrationAssets.ts").write_text("\n".join(lines), encoding="utf-8")

if __name__ == "__main__":
    main()
