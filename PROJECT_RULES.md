# HUTECHPOLY AI - QUY TẮC PHÁT TRIỂN & TIÊU CHUẨN DỰ ÁN (PROJECT RULES)

> **Dự Án Tốt Nghiệp CNTT • Khóa Luận Tốt Nghiệp Hiến Tặng Đại Học HUTECH**  
> **Tên đề tài:** *Hệ Thống Luyện Phản Xạ Hội Thoại Thông Minh Theo Chủ Đề Đa Dạng (Anh - Nhật - Hàn) Trao Tặng Trường Đại Học HUTECH*  
> **Nền tảng mục tiêu:** Web Application (Responsive) & Mobile App (Android APK qua Capacitor + iOS PWA)  
> **Mã định danh gói (App ID):** `vn.edu.hutech.polyai`

---

## 1. TỔNG QUAN ĐỀ TÀI & ĐỐI TƯỢNG THỤ HƯỞNG

Dự án **HutechPoly AI** được nghiên cứu và xây dựng theo mô hình **Luyện nói tự do theo chủ đề (Topic-Based)**, phá vỡ giới hạn của phương pháp học đàm thoại truyền thống (tuân theo kịch bản cứng nhắc, gò bó từng câu). Hệ thống trao quyền cho sinh viên lựa chọn ngữ cảnh hội thoại theo sở thích, đóng vai trò như một người bản xứ thông minh, thấu hiểu ngữ cảnh và linh hoạt hỗ trợ sửa lỗi.

### Đối tượng thụ hưởng chính tại HUTECH:
1. **Khoa Ngoại ngữ:** Sinh viên chuyên ngành Ngôn ngữ Anh và sinh viên toàn trường ôn luyện chuẩn đầu ra VSTEP B1/B2/C1, IELTS, tiếng Anh giao tiếp đời sống và công sở quốc tế.
2. **Viện Công nghệ Việt - Nhật (VJIT):** Sinh viên chương trình chuẩn Nhật Bản, rèn luyện Kaiwa giao tiếp thực tế từ N5 đến N2, tác phong doanh nghiệp Nhật (Hou-Ren-So), kính ngữ Sonkeigo/Kenjougo.
3. **Viện Công nghệ Việt - Hàn:** Sinh viên chương trình chuẩn Hàn Quốc, nâng cao phản xạ giao tiếp đời sống, chuẩn TOPIK 2 - 3, văn hóa xưng hô công sở Hàn Quốc.

---

## 2. KIẾN TRÚC HỆ THỐNG PHÂN TẦNG (LAYERED ARCHITECTURE)

Hệ thống được thiết kế theo mô hình kiến trúc phân tầng chuyên biệt nhằm tối ưu hóa tốc độ truyền tải âm thanh hai chiều thời gian thực (duplex real-time streaming) với độ trễ phản hồi toàn trình $\le 1.2\text{s}$:

```
┌─────────────────────────────────────────────────────────────────────────┐
│              TẦNG TRÌNH DIỄN (FRONTEND & MOBILE RUNTIME)                │
│   Next.js 15 (React 19 App Router) + Tailwind CSS + shadcn/ui           │
│   Capacitor 7 Native Runtime (Android APK) + iOS PWA Service Worker     │
│   Mascot Báo HUTECH + Audio Waveform Visualizer + Haptic Feedback       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ WebSocket (Full-Duplex Audio Stream)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│               TẦNG ĐIỀU PHỐI (BACKEND GATEWAY & REALTIME)               │
│   FastAPI WebSocket Server (Python 3.11+)                              │
│   Connection Pool Manager + Audio RAM Buffer Chunking (16kHz Mono)      │
└──────────────┬─────────────────────┬─────────────────────┬──────────────┘
               │ PCM Audio Stream    │ Text Tokens         │ LLM Prompting
               ▼                     ▼                     ▼
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│  DỊCH VỤ NHẬN DIỆN   │ │   BỘ NÃO TƯ DUY LLM  │ │   DỊCH VỤ PHÁT ÂM    │
│      STT ENGINE      │ │      CORE AGENT      │ │      TTS ENGINE      │
│ Deepgram Nova-2 API  │ │ Google Gemini 2.5    │ │ Microsoft Edge TTS   │
│     / Whisper API    │ │ Flash SDK            │ │ (edge-tts Python)    │
│ Tự nhận diện đa ngữ  │ │ Quản lý 8 lượt thoại │ │ Giọng bản ngữ chuẩn: │
│ Việt / Anh / Nhật /  │ │ Context + Ép chuẩn   │ │ US: Jenny/Guy        │
│ Hàn (Acc > 90%)      │ │ JSON Structured      │ │ JP: Nanami           │
│                      │ │ Output               │ │ KR: SunHi            │
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│               TẦNG DỮ LIỆU ĐÁM MÂY (PERSISTENCE LAYER)                  │
│   Supabase (PostgreSQL Cloud Managed)                                   │
│   Authentication: HUTECH Email Domain (@hutech.edu.vn)                  │
│   Tables: users, topics, sessions, chat_turns, mistakes_log             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. TECH STACK BẮT BUỘC & QUY ĐỊNH KỸ THUẬT

| Hạng Mục | Công Nghệ / Thư Viện | Phiên Bản | Quy Định Kỹ Thuật Chi Tiết |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js** | 15.x (React 19) | Sử dụng **App Router** (`src/app`), 100% **TypeScript** strict mode. Tối ưu hóa Static Export cho Capacitor đóng gói Mobile. |
| **Styling & UI Kit** | **Tailwind CSS + shadcn/ui** | Mới nhất | Tuân thủ triệt để Theme màu HUTECH. Thiết kế ưu tiên Mobile-First responsive. Tối ưu padding Safe Area tai thỏ/notch trên điện thoại. |
| **Mobile Runtime** | **Capacitor** | 7.x | Cấu hình `@capacitor/core`, `@capacitor/cli`, `@capacitor/haptics`. App ID: `vn.edu.hutech.polyai`. Build Android native (`npx cap sync android`). Xuất file `HutechPolyAI.apk`. |
| **PWA Support** | **next-pwa / Workbox** | Mới nhất | Cung cấp file `manifest.json`, icon maskable, Service Worker offline caching hỗ trợ sinh viên iPhone thêm ứng dụng vào Home Screen (Add to Home Screen). |
| **Backend Gateway** | **FastAPI** | 0.115+ | Python 3.11+, WebSockets xử lý song công duplex, quản lý connection pool, bộ đệm RAM buffer nhận audio streaming. |
| **Speech-to-Text (STT)**| **Deepgram Nova-2 / Whisper** | Cloud API | Xử lý streaming audio chunk 16kHz Mono. Tự động nhận diện đa ngữ thông minh (phát hiện cả khi sinh viên nói tiếng Việt lẫn ngoại ngữ). Độ chính xác nhận diện > 90%. |
| **Large Language Model**| **Google Gemini 2.5 Flash** | Official SDK | Cửa sổ trượt context lưu 8 turns đối thoại gần nhất. Nạp Prompt theo từng Persona chủ đề. Ép chặt chuẩn JSON Structured Output. |
| **Text-to-Speech (TTS)**| **Microsoft Edge TTS** | `edge-tts` (Python) | Giải pháp giọng đọc bản ngữ miễn phí, độ trễ thấp, không phụ thuộc API key trả phí. Trả về stream byte MP3 truyền trực tiếp về client. |
| **Cơ Sở Dữ Liệu** | **Supabase** | Cloud Postgres | Quản trị dữ liệu quan hệ, tích hợp Row Level Security (RLS). Đăng nhập xác thực bằng email sinh viên HUTECH (`@hutech.edu.vn`). |
| **Container & CI/CD** | **Docker & Vercel** | Multi-stage | Frontend deploy lên Vercel gắn SSL HTTPS (bắt buộc để trình duyệt cấp quyền Micro). Backend đóng gói Docker Container deploy lên Cloud Server (Render/Railway/VPS). |

---

## 4. BỘ NHẬN DIỆN THƯƠNG HIỆU HUTECH (BRAND IDENTITY GUIDELINES)

Mọi giao diện Web và Mobile App bắt buộc phải đồng bộ màu sắc và linh vật biểu trưng theo chuẩn cẩm nang nhận diện thương hiệu của Trường Đại học Công nghệ TP.HCM (HUTECH):

### 4.1. Bảng Màu Thương Hiệu (Color Palette)
* **Màu Xanh HUTECH (Primary Navy Blue):** `#003B7A`  
  * *Ứng dụng:* Header, Navigation Bar, Button chính, Tiêu đề phân hệ, Viền trạng thái kích hoạt.
* **Màu Cam HUTECH (Secondary Accent Orange):** `#F58220`  
  * *Ứng dụng:* Nút Push-to-Talk kích hoạt ghi âm, Icon trạng thái đang nói, Badge nổi bật, Điểm Streak, Điểm số tiến bộ.
* **Màu Trắng & Trung Tính (Neutrals):** `#FFFFFF`, Slate `#F8FAFC`, `#0F172A`  
  * *Ứng dụng:* Nền giao diện thẻ học tập, chữ tương phản cao, Dark mode hài hòa chuẩn shadcn/ui.

### 4.2. Linh Vật & Biểu Trưng (Mascot & Iconography)
* **Linh vật:** **Báo HUTECH (Cheetah Mascot)**.
  * Xuất hiện sinh động tại trung tâm màn hình phòng thoại Voice Room (`/room/[topic_id]`).
  * Có hoạt ảnh (Animation/Lottie/CSS) tương tác: Trạng thái chờ (Idle nháy mắt), Trạng thái lắng nghe sinh viên (Listening với sóng âm bao quanh), Trạng thái suy nghĩ (Thinking), Trạng thái đang trả lời (Speaking gật gù).
* **Biểu tượng ứng dụng (App Icon & Splash Screen):**
  * Icon ứng dụng Android và PWA: Logo nhận diện HutechPoly AI kết hợp đầu Báo HUTECH hiện đại trên nền xanh `#003B7A`.
  * Splash Screen: Khởi động app hiển thị biểu trưng HUTECH và khẩu hiệu đồ án tốt nghiệp hiến tặng.

---

## 5. NGUYÊN TẮC CƠ CHẾ SONG NGỮ (BILINGUAL FALLBACK MECHANISM)

Đây là **tính năng cốt lõi tạo nên sự khác biệt học thuật** của đề tài HutechPoly AI nhằm tháo gỡ triệt để rào cản tâm lý sợ sai, bí từ khi sinh viên luyện nói.

```
Sinh viên đang luyện chủ đề
           │
           ▼
[Sinh viên bị "bí từ" / không nhớ mẫu câu ngoại ngữ]
           │
           ▼
Sinh viên nói chêm Tiếng Việt vào câu
(Ví dụ: "I want to apply for this job because tôi có 2 năm kinh nghiệm làm React")
           │
           ▼
Micro Thu âm 16kHz ──> WebSocket ──> STT Service (Deepgram/Whisper)
           │
           ▼
Bộ Não Gemini 2.5 Flash phân tích ý định và ngữ cảnh
           │
           ├───────────────────────────────┬───────────────────────────────┐
           ▼                               ▼                               ▼
AI KHÔNG dịch thô câu nói        AI phản xạ bằng NGOẠI NGỮ       AI nhận xét & gợi ý
(Tuyệt đối không chuyển hội      mục tiêu chuẩn mực bản xứ       từ vựng thay thế cho
thoại sang hoàn toàn tiếng Việt) kèm giải thích tinh tế          từ tiếng Việt sinh viên bí
```

### 5.1. Định dạng JSON Structured Output Bắt Buộc từ Gemini 2.5 Flash
Hệ thống không nhận phản hồi dạng văn bản thô (free-form text) từ LLM. Mọi phản hồi của AI qua WebSocket bắt buộc phải tuân theo cấu trúc JSON sau:

```json
{
  "ai_response": "That's fantastic! Having two years of hands-on experience with React is a solid asset for a Frontend Intern. Could you share a challenging bug you encountered and how you solved it?",
  "vi_translation": "Tuyệt vời quá! Có hai năm kinh nghiệm thực chiến với React là một lợi thế vững chắc cho vị trí Thực tập sinh Frontend. Bạn có thể chia sẻ một lỗi khó khăn bạn từng gặp và cách bạn đã xử lý nó không?",
  "grammar_feedback": "Bạn nói chêm: 'tôi có 2 năm kinh nghiệm làm React' -> Nên nói: 'I have two years of experience working with React' hoặc 'I've spent two years developing with React'.",
  "vocabulary_hints": [
    "hands-on experience: kinh nghiệm thực chiến",
    "encounter a bug: gặp phải lỗi mã nguồn"
  ],
  "suggested_replies": [
    "I encountered a state management issue with Redux and solved it by...",
    "I had trouble with API caching, so I implemented React Query to..."
  ]
}
```

---

## 6. TÍNH NĂNG HỌC THUẬT ĐẶC THÙ THEO 3 PHÂN HỆ KHOA / VIỆN

Để đáp ứng chính xác nhu cầu của 3 đơn vị thụ hưởng, giao diện và logic phản hồi được trang bị các tính năng học thuật độc quyền:

### 6.1. Khoa Ngoại Ngữ (Tiếng Anh - VSTEP / IELTS / Career)
* **Ký hiệu Phiên Âm Quốc Tế IPA (`IPAPhonetics.tsx`):**
  * Hiển thị bảng phiên âm chuẩn IPA phía trên các từ vựng học thuật B2 - C1.
  * Tích hợp tính năng gạch chân tương tác: Sinh viên bấm trực tiếp vào từ bất kỳ trên màn hình để nghe lại phát âm mẫu và xem giải nghĩa ngữ cảnh.
* **Mẫu câu Signposting (Chuyển ý học thuật):**
  * AI rèn luyện cho sinh viên kỹ năng thuyết trình và phản biện tranh luận sử dụng các cấu trúc: *Firstly, To illustrate, Moving on, In conclusion, On the contrary...*

### 6.2. Viện Công Nghệ Việt - Nhật (VJIT - Tiếng Nhật Kaiwa N5 - N2)
* **Furigana Chuẩn Thẻ HTML `<ruby>` (`RubyFuriganaText.tsx`):**
  * Mọi văn bản tiếng Nhật trả về từ AI có chữ Hán (Kanji) bắt buộc phải được bọc thẻ HTML `<ruby>` để hiển thị chữ phiên âm Hiragana nhỏ trên đầu:
    $$\text{Ví dụ: } \texttt{<ruby>秋葉原<rt>あきはばら</rt></ruby>}$$
  * Giúp sinh viên VJIT đọc trôi chảy, không bị gián đoạn mạch hội thoại do quên cách đọc Kanji.
* **Luyện Kính Ngữ & Quy Tắc Doanh Nghiệp Nhật:**
  * Hỗ trợ nhận diện và sửa lỗi kính ngữ tôn kính (Sonkeigo - 尊敬語), khiêm nhường ngữ (Kenjougo - 謙譲語), và văn hóa báo cáo công việc Hou-Ren-So (報・連・相).

### 6.3. Viện Công Nghệ Việt - Hàn (Tiếng Hàn Giao Tiếp & TOPIK)
* **Badge Kính Ngữ & Phong Cách Đuôi Câu (`KoreanBadge.tsx`):**
  * Tự động gắn nhãn Badge màu sắc phân biệt phong cách câu giao tiếp:
    * **Trang trọng (Formal):** Đuôi câu `-ㅂ니다 / -습니다` (xanh navy).
    * **Thân mật lịch sự (Polite Informal):** Đuôi câu `-아/어요` (cam pastel).
    * **Kính ngữ xưng hô:** Đuôi câu `-(으)시-`.
* **Hỗ trợ Phiên Âm Romaja:**
  * Cung cấp nút chuyển đổi bật/tắt chữ Latin Romaja cho sinh viên năm nhất hoặc người mới bắt đầu học tiếng Hàn.

---

## 7. QUY TẮC PHÁT TRIỂN & TIÊU CHUẨN MÃ NGUỒN (DEVELOPMENT STANDARDS)

1. **Cấu trúc Monorepo thống nhất:**
   * `/frontend`: Ứng dụng Next.js 15, Tailwind CSS, Capacitor 7 config, PWA manifest.
   * `/backend`: Dịch vụ FastAPI, WebSocket server, các module `stt_service.py`, `gemini_service.py`, `tts_service.py`.
   * `/docs`: Toàn bộ tài liệu SRS, UML Sequence Diagrams, Báo cáo Khóa luận 100 trang.
2. **Quản lý biến môi trường (.env):**
   * Tuyệt đối không commit API Key lên Git.
   * Mọi cấu hình nhạy cảm (`GEMINI_API_KEY`, `DEEPGRAM_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`) phải được khai báo trong `.env.example`.
3. **Độ trễ phản hồi âm thanh (Audio Latency Target):**
   * Luồng xử lý từ lúc người dùng thả phím Push-to-Talk đến khi loa client phát ra âm thanh đầu tiên phải đạt **$\le 1.2$ giây**.
   * Bộ đệm âm thanh tại Frontend phải gửi các chunk nén 16kHz định kỳ 250ms - 500ms để giảm tải băng thông.
4. **Cam kết chất lượng đồ án tốt nghiệp:**
   * Mã nguồn sạch sẽ, chú thích rõ ràng, đáp ứng đầy đủ 25 Use Cases đặc tả trong SRS và 24 chủ đề thực chiến sẵn sàng hiến tặng Trường Đại học HUTECH.
