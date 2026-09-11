# HUTECHPOLY AI - LỘ TRÌNH TRIỂN KHAI 12 TUẦN & MA TRẬN 24 CHỦ ĐỀ ĐA NGỮ

> **Dự án Khóa luận Tốt nghiệp CNTT Hiến tặng Trường Đại học HUTECH**  
> **Tài liệu điều phối tiến độ & Danh mục chủ đề học thuật (Project Roadmap & Topic Backlog)**  
> **Tổng thời gian thực hiện:** 12 Tuần (84 Ngày) • **Quy mô:** 32 Nhiệm vụ trọng tâm (TSK-01 đến TSK-32) • **Chủ đề:** 24 Chủ đề đàm thoại thực chiến

---

## PHẦN 1: LỘ TRÌNH 12 TUẦN TRIỂN KHAI HOÀN THIỆN ĐỒ ÁN HIẾN TẶNG

```
Tuần 01-02       Tuần 03-04       Tuần 05-06       Tuần 07-08       Tuần 09-10       Tuần 11-12
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ GIAI     │────>│ GIAI     │────>│ GIAI     │────>│ GIAI     │────>│ GIAI     │────>│ GIAI     │
│ ĐOẠN 1   │     │ ĐOẠN 2   │     │ ĐOẠN 3   │     │ ĐOẠN 4   │     │ ĐOẠN 5   │     │ ĐOẠN 6   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘
Khảo sát,        Giao diện Web    Voice Pipeline   Gemini 2.5 Flash Sổ tay lỗi sai,  Pilot Test,
Dataset 24 Topic & Mobile App,    Realtime, STT,   & Phản hồi       Build APK,       Viết Khóa luận
và Kiến trúc     Capacitor 7      Edge TTS         Đa ngữ           Vercel & Docker  & Bàn giao tặng
```

---

### GIAI ĐOẠN 1: KHẢO SÁT CHUẨN ĐẦU RA, MA TRẬN CHỦ ĐỀ & THIẾT KẾ DỮ LIỆU
**Thời gian:** Tuần 1 - Tuần 2 (Ngày 1 - 14)  
**Mục tiêu:** Định hình đầy đủ tài liệu đặc tả, bộ dữ liệu 24 chủ đề mẫu và kiến trúc hệ thống chuẩn mực.

| Task ID | Tuần | Ngày | Hạng Mục Công Việc | Phân Hệ (Module) | Chi Tiết Kỹ Thuật Thực Thi | Đầu Ra (Deliverable) | Tiêu Chí Chấp Nhận (Acceptance Criteria) | Trạng Thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TSK-01** | Tuần 1 | Ngày 1-2 | Khảo sát chuẩn đầu ra 3 Khoa/Viện HUTECH | Academic Research | Khảo sát trực tiếp sở thích giao tiếp sinh viên Khoa Ngoại ngữ, Viện VJIT và Viện Việt - Hàn HUTECH. Tổng hợp chuẩn VSTEP B1/B2, Minna no Nihongo N4/N3, TOPIK 2-3. | Tài liệu khảo sát học thuật (SRS Input) | Có đủ tiêu chí đánh giá cho 3 ngôn ngữ Anh - Nhật - Hàn. | `TODO` |
| **TSK-02** | Tuần 1 | Ngày 3-4 | Viết tài liệu đặc tả SRS (25 Use Cases) | Docs / Requirement | Đặc tả 25 Use Cases: Chọn chủ đề tự do, chuyển đổi ngôn ngữ, duplex voice stream, bilingual hints, mistake log, chấm lỗi ngữ pháp. | Bản tài liệu SRS v1.0 | Đầy đủ 25 use case theo chuẩn IEEE, mô tả rõ Actor Student & Admin. | `TODO` |
| **TSK-03** | Tuần 1 | Ngày 5-7 | Xây dựng Dataset 24 Chủ đề đàm thoại | AI Content / Dataset | Xây dựng ngân hàng dữ liệu 24 chủ đề (8 Anh, 8 Nhật, 8 Hàn) gồm roleplay persona, opening ice-breaker, key vocab và mục tiêu trò chuyện. | File `topics_seed.json` | 24 chủ đề có đầy đủ dữ liệu mở đầu, ngữ cảnh và từ vựng trọng tâm. | `TODO` |
| **TSK-04** | Tuần 2 | Ngày 8-10 | Thiết kế sơ đồ Kiến trúc & Sequence Diagram | Architecture Design | Thiết kế sơ đồ kiến trúc hệ thống, sơ đồ tuần tự xử lý âm thanh thời gian thực (Client Audio $\rightarrow$ WS $\rightarrow$ STT $\rightarrow$ Gemini $\rightarrow$ TTS $\rightarrow$ Client Audio). | Diagrams (PNG/UML) | Sơ đồ rõ ràng, độ trễ thiết kế lý thuyết đạt $< 1.5\text{s}$. | `TODO` |
| **TSK-05** | Tuần 2 | Ngày 11-12 | Thiết kế Database Schema Supabase | Cloud Database | Thiết kế cơ sở dữ liệu quan hệ trên Supabase gồm các bảng: `users`, `topics`, `sessions`, `chat_turns`, `mistakes_log`. Viết file SQL migration. | File `schema.sql` | Khóa chính, khóa ngoại, RLS và index hoạt động tốt trên Supabase. | `TODO` |
| **TSK-06** | Tuần 2 | Ngày 13-14 | Thiết lập Monorepo Git & Môi trường | DevOps / Setup | Thiết lập Monorepo Git (frontend Next.js 15 + backend FastAPI), cấu hình `.gitignore` gộp Python/Node, tạo file cấu hình môi trường `.env.example`. | Git Repository & `.env.example` | Clone và khởi động thành công trên môi trường mới không lỗi xung đột. | `TODO` |

---

### GIAI ĐOẠN 2: DỰNG GIAO DIỆN WEB & MOBILE APP (THIẾT KẾ DẠNG THẺ CHỦ ĐỀ)
**Thời gian:** Tuần 3 - Tuần 4 (Ngày 15 - 28)  
**Mục tiêu:** Hoàn thiện toàn bộ giao diện Web Responsive và tích hợp Capacitor 7 đóng gói ứng dụng di động.

| Task ID | Tuần | Ngày | Hạng Mục Công Việc | Phân Hệ (Module) | Chi Tiết Kỹ Thuật Thực Thi | Đầu Ra (Deliverable) | Tiêu Chí Chấp Nhận (Acceptance Criteria) | Trạng Thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TSK-07** | Tuần 3 | Ngày 15-17 | Khởi tạo Next.js 15 & Theme HUTECH | Frontend Web | Khởi tạo Next.js 15 App Router + Tailwind CSS + shadcn/ui; cấu hình Theme HUTECH với Navy `#003B7A` và Orange `#F58220`. | Frontend Base Skeleton | Giao diện chuẩn màu sắc HUTECH, tương thích mobile-first responsive. | `TODO` |
| **TSK-08** | Tuần 3 | Ngày 18-19 | Màn hình "Khám phá chủ đề" (Topic Grid) | Frontend Web | Dựng màn hình `/topics`: Thiết kế dạng lưới thẻ (Topic Cards) trực quan có icon khoa viện, filter bar ngôn ngữ, badge cấp độ (Dễ, Vừa, Nâng cao). | Component `TopicCard.tsx` & Page `/topics` | Bộ lọc mượt mà theo 3 Khoa/Viện, hiển thị đầy đủ thông tin chủ đề. | `TODO` |
| **TSK-09** | Tuần 3 | Ngày 20-21 | Màn hình Giao tiếp Phòng thoại (Voice Room) | Frontend Web | Dựng màn hình `/room/[topic_id]`: Linh vật Báo HUTECH tương tác sinh động, Audio Waveform Visualizer gợn sóng và nút tròn Push-to-Talk. | Page `/room` | Hiệu ứng sóng âm phản hồi theo âm lượng giọng nói thực tế. | `TODO` |
| **TSK-10** | Tuần 4 | Ngày 22-24 | Tích hợp Capacitor 7 Android Native | Mobile Native | Cài đặt `@capacitor/core`, `@capacitor/cli`, cấu hình `capacitor.config.ts` với App ID `vn.edu.hutech.polyai`, đồng bộ mã sang Android Studio. | Android Project Directory | Mở và build thử thành công trong Android Studio không phát sinh lỗi. | `TODO` |
| **TSK-11** | Tuần 4 | Ngày 25-26 | Tích hợp Haptic Feedback & Safe Area | Mobile Native UX | Tích hợp `@capacitor/haptics` tạo hiệu ứng rung nhẹ khi chạm/thả nút micro; xử lý padding chống tràn viền notch/tai thỏ trên smartphone. | Native UX Modules | Rung mượt mà trên thiết bị Android thật, không bị che khuất nội dung. | `TODO` |
| **TSK-12** | Tuần 4 | Ngày 27-28 | Cấu hình PWA cho thiết bị iOS (iPhone) | Mobile Web / PWA | Cấu hình Service Worker, Web Manifest, Apple Touch Icons cho phép sinh viên iPhone cài trực tiếp vào màn hình chính (Add to Home Screen). | `manifest.json` & PWA Assets | Trải nghiệm toàn màn hình (standalone) không viền trình duyệt trên iOS Safari. | `TODO` |

---

### GIAI ĐOẠN 3: XỬ LÝ ÂM THANH REALTIME (VOICE PIPELINE)
**Thời gian:** Tuần 5 - Tuần 6 (Ngày 29 - 42)  
**Mục tiêu:** Xây dựng cầu nối truyền tải giọng nói 2 chiều qua WebSocket đạt độ trễ ban đầu $< 1.5\text{s}$.

| Task ID | Tuần | Ngày | Hạng Mục Công Việc | Phân Hệ (Module) | Chi Tiết Kỹ Thuật Thực Thi | Đầu Ra (Deliverable) | Tiêu Chí Chấp Nhận (Acceptance Criteria) | Trạng Thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TSK-13** | Tuần 5 | Ngày 29-31 | Hook `useAudioRecorder` (Web Audio API) | Frontend Audio | Lập trình Hook xin quyền micro, thu âm PCM 16kHz Mono, phân đoạn nén dữ liệu truyền tải theo chu kỳ qua WebSocket. | Hook `useAudioRecorder.ts` | Ghi âm sắc nét, kích thước byte tối ưu, không gián đoạn luồng mạng. | `TODO` |
| **TSK-14** | Tuần 5 | Ngày 32-35 | FastAPI WebSocket Gateway & Connection Pool | Backend Core | Xây dựng endpoint `/ws/voice/{topic_id}`, quản lý connection pool đa người dùng và bộ đệm RAM buffer nhận audio streaming. | Module `websocket_manager.py` | Xử lý kết nối song công ổn định, đóng ngắt an toàn khi ngắt kết nối. | `TODO` |
| **TSK-15** | Tuần 6 | Ngày 36-38 | Tích hợp STT Engine (Deepgram / Whisper) | AI STT Service | Tích hợp Deepgram Nova-2 / Whisper API: Tự động nhận diện đa ngữ (tiếng Việt và ngoại ngữ) từ luồng audio micro. | Module `stt_service.py` | Chuyển giọng nói sang văn bản với độ chính xác nhận diện $> 90\%$. | `TODO` |
| **TSK-16** | Tuần 6 | Ngày 39-40 | Tích hợp TTS Engine (Microsoft Edge TTS) | AI TTS Service | Tích hợp thư viện Python `edge-tts`: Phát âm chuẩn bản ngữ (Anh: Jenny/Guy, Nhật: Nanami, Hàn: SunHi). Stream byte MP3 về client. | Module `tts_service.py` | Âm thanh giọng nói tự nhiên, thời gian tạo audio tức thì, không tốn phí API. | `TODO` |
| **TSK-17** | Tuần 6 | Ngày 41-42 | Hoàn thiện vòng lặp Voice-to-Voice Loop | Integration | Kết nối trọn vẹn chu trình 2 chiều: Micro $\rightarrow$ WebSocket $\rightarrow$ STT $\rightarrow$ TTS $\rightarrow$ Loa thiết bị. Kiểm thử độ trễ ban đầu. | Vòng lặp Audio trọn vẹn | Độ trễ phản hồi âm thanh bước đầu đo đạc đạt $< 1.5\text{s}$. | `TODO` |

---

### GIAI ĐOẠN 4: BỘ NÃO GEMINI FLASH & TÍNH NĂNG ĐA NGỮ THEO CHỦ ĐỀ
**Thời gian:** Tuần 7 - Tuần 8 (Ngày 43 - 56)  
**Mục tiêu:** Cài đặt trí tuệ nhân tạo Gemini 2.5 Flash, cơ chế cứu cánh song ngữ và các tính năng học thuật đặc thù cho 3 Khoa/Viện.

| Task ID | Tuần | Ngày | Hạng Mục Công Việc | Phân Hệ (Module) | Chi Tiết Kỹ Thuật Thực Thi | Đầu Ra (Deliverable) | Tiêu Chí Chấp Nhận (Acceptance Criteria) | Trạng Thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TSK-18** | Tuần 7 | Ngày 43-45 | Tích hợp Google Gemini 2.5 Flash SDK | Backend AI | Nạp System Prompt theo từng Persona chủ đề đã chọn; duy trì cửa sổ trượt bộ nhớ ngữ cảnh 8 lượt thoại gần nhất. | Module `gemini_service.py` | Phản hồi AI thông minh, đúng vai trò và ngữ cảnh chủ đề được chọn. | `TODO` |
| **TSK-19** | Tuần 7 | Ngày 46-47 | Cơ chế Song ngữ cốt lõi (Nói VN $\rightarrow$ Đáp Ngoại ngữ) | Prompt Engineering | Thiết lập nguyên tắc: Khi sinh viên bí từ nói chêm tiếng Việt, AI hiểu ý định nhưng đối đáp bằng ngoại ngữ mục tiêu kèm giải thích. | Module `bilingual_prompt.py` | AI không dịch thô ngữ nghĩa, khéo léo dẫn dắt sinh viên dùng ngoại ngữ. | `TODO` |
| **TSK-20** | Tuần 7 | Ngày 48-49 | Ép chuẩn JSON Structured Output | Backend AI | Ép chuẩn JSON đầu ra từ Gemini: `{ ai_response, vi_translation, grammar_feedback, vocabulary_hints, suggested_replies }`. | Schema Validation | Dữ liệu trả về luôn parse được JSON 100%, không bị gãy giao diện. | `TODO` |
| **TSK-21** | Tuần 8 | Ngày 50-52 | Render Furigana Thẻ `<ruby>` cho Viện VJIT | Frontend VJIT | Lập trình component tự động phân tích và gắn thẻ HTML `<ruby>漢字<rt>かんじ</rt></ruby>` cho mọi chữ Hán tiếng Nhật. | Component `RubyFuriganaText.tsx` | Chữ Hiragana nhỏ trên đầu chữ Hán hiển thị sắc nét, chuẩn thẩm mỹ. | `TODO` |
| **TSK-22** | Tuần 8 | Ngày 53-54 | Badge Kính Ngữ & Romaja cho Viện Việt - Hàn | Frontend Việt-Hàn | Tạo badge phân loại phong cách câu (`-ㅂ니다/습니다` vs `-아/어요`), hiển thị phiên âm chữ Romaja cho sinh viên mới học. | Component `KoreanBadge.tsx` | Phân loại chính xác phong cách câu và hỗ trợ bật/tắt Romaja tiện lợi. | `TODO` |
| **TSK-23** | Tuần 8 | Ngày 55-56 | Ký hiệu Phiên âm IPA cho Khoa Ngoại Ngữ | Frontend English | Tích hợp bảng tra cứu ký hiệu ngữ âm quốc tế IPA cho từ vựng B2 - C1; gạch chân từ vựng cho phép bấm tra nhanh. | Component `IPAPhonetics.tsx` | Bấm vào từ vựng là mở modal/tooltip giải thích IPA và nghe phát âm. | `TODO` |

---

### GIAI ĐOẠN 5: SỔ TAY LỖI SAI, BUILD APK & TRIỂN KHAI PRODUCTION
**Thời gian:** Tuần 9 - Tuần 10 (Ngày 57 - 70)  
**Mục tiêu:** Xây dựng tính năng theo dõi tiến độ, xuất bản gói cài đặt Android APK và deploy toàn bộ hệ thống lên Cloud.

| Task ID | Tuần | Ngày | Hạng Mục Công Việc | Phân Hệ (Module) | Chi Tiết Kỹ Thuật Thực Thi | Đầu Ra (Deliverable) | Tiêu Chí Chấp Nhận (Acceptance Criteria) | Trạng Thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TSK-24** | Tuần 9 | Ngày 57-59 | Xây dựng "Sổ tay lỗi sai" (Mistakes Notebook) | Feature UI & DB | Thu thập các câu nói sai từ JSON vào Supabase; tạo giao diện xem lại, lọc theo chủ đề và nút "Nói lại câu này". | Màn hình `/notebook` | Lưu trữ lỗi chính xác, cho phép sinh viên luyện tập lại câu đã nói sai. | `TODO` |
| **TSK-25** | Tuần 9 | Ngày 60-63 | Dashboard Thống kê Tiến bộ & Streak | Feature Analytics | Thống kê tổng số phút nói chuyện, số từ vựng mới tích lũy, bảng xếp hạng chủ đề luyện tập nhiều nhất và chuỗi ngày học liên tục (Streak). | Màn hình `/dashboard` | Biểu đồ trực quan, số liệu thống kê cập nhật realtime theo từng phiên. | `TODO` |
| **TSK-26** | Tuần 10 | Ngày 64-66 | Build & Ký số gói cài đặt `HutechPolyAI.apk` | Mobile Release | Thiết kế Icon Báo HUTECH, màn hình chờ Splash Screen; biên dịch bản release Android xuất file `HutechPolyAI.apk`. | File cài đặt `HutechPolyAI.apk` | Ứng dụng cài đặt và vận hành mượt mà trên các thiết bị Android từ phiên bản 10 trở lên. | `TODO` |
| **TSK-27** | Tuần 10 | Ngày 67-70 | Deploy Web lên Vercel & Backend lên Cloud | Cloud Deployment | Triển khai Frontend lên Vercel cấu hình chứng chỉ HTTPS (bắt buộc cho quyền micro); đóng gói Docker Backend FastAPI lên VPS/Cloud. | Hệ thống Production Live URL | Hệ thống chạy ổn định 24/7, kết nối WebSocket hoạt động trơn tru qua SSL. | `TODO` |

---

### GIAI ĐOẠN 6: PILOT TEST, VIẾT KHÓA LUẬN & BÀN GIAO HIẾN TẶNG
**Thời gian:** Tuần 11 - Tuần 12 (Ngày 71 - 84)  
**Mục tiêu:** Thử nghiệm thực tế với sinh viên HUTECH, hoàn thiện báo cáo khóa luận 100 trang và chuẩn bị bảo vệ trước Hội đồng.

| Task ID | Tuần | Ngày | Hạng Mục Công Việc | Phân Hệ (Module) | Chi Tiết Kỹ Thuật Thực Thi | Đầu Ra (Deliverable) | Tiêu Chí Chấp Nhận (Acceptance Criteria) | Trạng Thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TSK-28** | Tuần 11 | Ngày 71-74 | Thử nghiệm diện hẹp (Pilot Test) 50 Sinh viên | Testing & Validation | Cho 50 sinh viên tại 3 Khoa/Viện tự do chọn 24 chủ đề luyện nói trong 3 ngày; thu thập nhật ký log hệ thống và phản hồi. | Tập dữ liệu Pilot Test Logs | Thu nhận dữ liệu tương tác thực tế từ sinh viên 3 chuyên ngữ khác nhau. | `TODO` |
| **TSK-29** | Tuần 11 | Ngày 75-77 | Đo đạc Latency & Khảo sát Thang đo SUS | Scientific Evaluation | Đo đạc độ trễ phản hồi thực tế ($< 1.2\text{s}$), tỷ lệ chính xác STT và tính toán điểm thang đo mức độ khả dụng hệ thống SUS. | Báo cáo Thực nghiệm & SUS | Đạt điểm SUS $> 75$ điểm (mức Tốt/Xuất sắc), minh chứng bằng số liệu khoa học. | `TODO` |
| **TSK-30** | Tuần 12 | Ngày 78-80 | Hoàn thiện Báo cáo Khóa luận 100 trang | Academic Thesis | Hoàn thiện cuốn Báo cáo Khóa luận tốt nghiệp đúng quy chuẩn định dạng Khoa CNTT HUTECH (5 chương, tài liệu tham khảo, phụ lục). | Cuốn Khóa luận PDF hoàn chỉnh | Hoàn thành cuốn khóa luận 100 trang nộp về văn phòng Khoa CNTT. | `TODO` |
| **TSK-31** | Tuần 12 | Ngày 81-82 | Đóng gói Mã nguồn & Hồ sơ Hiến tặng HUTECH | Project Handover | Đóng gói USB mã nguồn sạch (Git Repo), file cài đặt APK, tài liệu quản trị và biên bản bàn giao hiến tặng Trường HUTECH. | Bộ USB & Biên bản Hiến tặng | Sẵn sàng thủ tục bàn giao sản phẩm phần mềm cho nhà trường sử dụng. | `TODO` |
| **TSK-32** | Tuần 12 | Ngày 83-84 | Thiết kế Slide Báo cáo & Kịch bản Demo Hội Đồng | Defense Preparation | Thiết kế Slide thuyết trình chuẩn nhận diện thương hiệu HUTECH; in mã QR trên standee để Hội đồng quét trải nghiệm trực tiếp. | Bộ Slide PPTX + Standee QR | Hội đồng chấm khóa luận quét QR và đối đáp trực tiếp với AI mượt mà. | `TODO` |

---

## PHẦN 2: MA TRẬN 24 CHỦ ĐỀ ĐÀM THOẠI ĐA NGỮ (TOPIC BACKLOG)

Danh mục 24 chủ đề tiêu biểu được phân bổ đồng đều cho 3 Khoa/Viện trực thuộc Trường Đại học HUTECH, bao phủ từ giao tiếp đời sống, văn hóa, ẩm thực đến môi trường học thuật và tuyển dụng chuyên nghiệp.

```
                  ┌────────────────────────────────────────┐
                  │    MA TRẬN 24 CHỦ ĐỀ HUTECHPOLY AI     │
                  └───────────────────┬────────────────────┘
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│  KHOA NGOẠI NGỮ  │        │    VIỆN VJIT     │        │  VIỆN VIỆT - HÀN │
│ (Tiếng Anh - 8)  │        │ (Tiếng Nhật - 8) │        │ (Tiếng Hàn - 8)  │
│ ENG-T01 ~ ENG-T08│        │ JPN-T01 ~ JPN-T08│        │ KOR-T01 ~ KOR-T08│
└──────────────────┘        └──────────────────┘        └──────────────────┘
```

---

### PHÂN HỆ 1: KHOA NGOẠI NGỮ (TIẾNG ANH - VSTEP / IELTS / GIAO TIẾP QUỐC TẾ)

| Mã Chủ Đề | Nhóm Chủ Đề | Tên Chủ Đề Cụ Thể (Topic Name) | Bối Cảnh & Vai Trò AI (AI Persona) | Tính Năng Học Thuật Hỗ Trợ | Từ Vựng Trọng Tâm (Key Vocab Sample) |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **ENG-T01** | Đời Sống & Du Lịch | Du lịch bụi & Khám phá văn hóa bản địa *(Backpacking)* | Người bạn phượt thủ bản địa / Local tour guide | Hội thoại tự do về trải nghiệm du lịch, chia sẻ sở thích; AI hỗ trợ từ vựng du lịch & phiên âm chuẩn IPA. | `itinerary`, `hostel`, `scenic`, `culture`, `explore` |
| **ENG-T02** | Đời Sống & Ẩm Thực | Review quán Cafe & Ẩm thực đường phố *(Food & Coffee)* | Nhân viên pha chế sành điệu / Food reviewer | Thảo luận hương vị, gọi món, văn hóa Tip tại phương Tây; sửa lỗi diễn đạt tính từ miêu tả món ăn. | `aroma`, `roast`, `crispy`, `savory`, `street food` |
| **ENG-T03** | Học Thuật HUTECH | Đời sống sinh viên HUTECH & Câu lạc bộ *(Campus Life)* | Sinh viên khóa trên HUTECH (Senior Student) | Chia sẻ về tín chỉ, học phần, thi cử, hoạt động Mùa hè xanh; AI phản xạ chuẩn ngữ điệu tự nhiên. | `credits`, `midterm`, `presentation`, `club`, `volunteer` |
| **ENG-T04** | Học Thuật & Tranh Luận | Trí tuệ nhân tạo (AI) và tương lai việc làm *(Debate)* | Học giả phản biện tranh luận học thuật | Rèn luyện kỹ năng phản biện VSTEP B2-C1; AI đưa ra lập luận đa chiều kích thích sinh viên tư duy nói. | `automation`, `prompt engineering`, `displace`, `ethics` |
| **ENG-T05** | Việc Làm & Phỏng Vấn | Phỏng vấn vị trí Thực tập sinh Công ty Quốc tế *(Job Interview)* | Giám đốc nhân sự tập đoàn đa quốc gia (HR Manager) | Luyện phản xạ câu hỏi tình huống mô hình STAR; AI nhận xét cấu trúc ngữ pháp và sự tự tin phát âm. | `strength`, `weakness`, `problem-solving`, `team player` |
| **ENG-T06** | Công Sở & Hợp Tác | Thuyết trình dự án & Đàm phán nhóm *(Project Presentation)* | Trưởng nhóm dự án / Đối tác nước ngoài | Rèn luyện cách mở đầu bài nói, chuyển ý trang trọng sử dụng Signposting phrases. | `firstly`, `to illustrate`, `moving on`, `in conclusion` |
| **ENG-T07** | Văn Hóa & Xã Hội | Điện ảnh, Âm nhạc Âu Mỹ & Pop Culture *(Entertainment)* | Bạn thân quốc tế có chung niềm đam mê Pop Culture | Trò chuyện thoải mái về nghệ sĩ, rạp phim yêu thích; giúp sinh viên gỡ bỏ áp lực sợ sai ngữ pháp. | `soundtrack`, `blockbuster`, `genre`, `hype`, `iconic` |
| **ENG-T08** | Tình Huống Khẩn Cấp | Xử lý khiếu nại, thất lạc hành lý & Y tế *(Emergency)* | Nhân viên hỗ trợ hành lý sân bay / Cứu hộ | Phản xạ nhanh khi gặp rắc rối ở nước ngoài; cung cấp mẫu câu xử lý nguy cấp (Emergency Hints). | `lost luggage`, `claim tag`, `compensation`, `urgent` |

---

### PHÂN HỆ 2: VIỆN CÔNG NGHỆ VIỆT - NHẬT (VJIT - TIẾNG NHẬT KAIWA N5 - N2)

| Mã Chủ Đề | Nhóm Chủ Đề | Tên Chủ Đề Cụ Thể (Topic Name) | Bối Cảnh & Vai Trò AI (AI Persona) | Tính Năng Học Thuật Hỗ Trợ | Từ Vựng Trọng Tâm (Key Vocab Sample) |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **JPN-T01** | Đời Sống & Mua Sắm | Dạo phố Akihabara & Mua sắm đồ điện tử, Anime | Nhân viên bán hàng tại trung tâm Akihabara | Hội thoại tự do sở thích Anime/Manga; hỗ trợ Furigana thẻ `<ruby>` trên toàn bộ chữ Hán (Kanji). | `秋葉原`, `フィギュア`, `免税 (Tax-free)`, `限定` |
| **JPN-T02** | Ẩm Thực & Quán Xá | Văn hóa quán nhậu Izakaya & Thói quen ẩm thực Nhật | Chủ quán quán nhậu Izakaya thân thiện | Cách gọi món, nâng ly (Kanpai), nói chuyện phiếm; tự động nhận diện tiếng Việt khi sinh viên bí từ. | `居酒屋`, `とりあえずビール`, `乾杯`, `お会計` |
| **JPN-T03** | Môi Trường VJIT | Trao đổi học tập & Sinh hoạt cùng Sensei người Nhật | Giáo sư (Sensei) từ trường đại học đối tác Nhật | Luyện cách dùng kính ngữ chuẩn mực (Sonkeigo / Kenjougo) khi thưa gửi và trao đổi học tập với giáo viên. | `先生`, `相談`, `論文`, `締め切り`, `お疲れ様です` |
| **JPN-T04** | Việc Làm & Doanh Nghiệp | Phỏng vấn đơn hàng Kỹ sư & Tuyển dụng Nhật | Trưởng ban tuyển dụng doanh nghiệp CNTT Nhật Bản | Luyện Jikoshoukai (tự giới thiệu), nêu lý do muốn làm việc tại Nhật; AI chủ động sửa lỗi trợ từ は/が/を. | `自己紹介`, `志望動機`, `長所`, `ITエンジニア` |
| **JPN-T05** | Văn Hóa Công Sở | Giao tiếp Hou-Ren-So (Báo cáo - Liên lạc - Thảo luận) | Tiền bối người Nhật phụ trách dự án (Senpai) | Nhập vai làm việc công sở; hướng dẫn phản xạ báo cáo tiến độ công việc và xin nghỉ phép theo chuẩn Nhật. | `報告`, `連絡`, `相談`, `進捗 (Progress)`, `有給休暇` |
| **JPN-T06** | Du Lịch & Phương Tiện | Hỏi đường, đi tàu điện ngầm Shinkansen & Khách sạn Ryokan | Nhân viên ga tàu Tokyo / Chủ nhà nghỉ Ryokan | Thực hành hỏi giá vé, chuyển ga Tokyo; AI phát âm chuẩn giọng chuẩn Tokyo (Nanami TTS). | `新幹線`, `切符`, `乗り換え`, `旅館`, `温泉` |
| **JPN-T07** | Lễ Hội & Phong Tục | Lễ hội mùa hè (Matsuri), Hanami & Trà đạo Nhật Bản | Bạn du học sinh trao đổi người Nhật | Tìm hiểu và trò chuyện về văn hóa truyền thống Nhật; AI gợi ý câu phản hồi tiếp theo tự nhiên. | `祭り`, `花見`, `浴衣`, `茶道`, `伝統文化` |
| **JPN-T08** | Tình Huống Bất Ngờ | Đi khám bệnh tại phòng khám Nhật & Khai báo rắc rối | Bác sĩ / Y tá tại phòng khám đa khoa Tokyo | Phản xạ diễn tả triệu chứng cơ thể (đau đầu, sốt, dị ứng); kèm bản dịch đối chiếu song ngữ Việt - Nhật. | `頭痛`, `発熱`, `保険証`, `処方箋 (Toa thuốc)` |

---

### PHÂN HỆ 3: VIỆN CÔNG NGHỆ VIỆT - HÀN (TIẾNG HÀN GIAO TIẾP & TOPIK)

| Mã Chủ Đề | Nhóm Chủ Đề | Tên Chủ Đề Cụ Thể (Topic Name) | Bối Cảnh & Vai Trò AI (AI Persona) | Tính Năng Học Thuật Hỗ Trợ | Từ Vựng Trọng Tâm (Key Vocab Sample) |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **KOR-T01** | Đời Sống & Mua Sắm | Mua sắm mỹ phẩm & Mặc cả thời trang phố Dongdaemun | Chủ cửa hàng thời trang tại chợ Dongdaemun | Luyện số đếm, hỏi giá tiền, xin quà tặng kèm (Service); hiển thị phiên âm chữ Romaja cho người mới. | `얼마예요`, `깎아주세요`, `서비스`, `화장품` |
| **KOR-T02** | Ẩm Thực & Giới Trẻ | Ăn gà rán uống bia bên sông Hàn & Quán nướng BBQ | Bạn người Hàn cùng lứa tuổi tại công viên Hangang | Hội thoại tự nhiên về đồ ăn cay, văn hóa bàn ăn; nhận diện và phân loại phong cách câu thân mật (`-요`). | `치맥 (Chimaek)`, `삼겹살`, `맛있어요`, `건배` |
| **KOR-T03** | K-Pop & Đời Sống | Trò chuyện về thần tượng K-Pop, K-Drama & Idol concert | Người bạn bản xứ hâm mộ làn sóng Hallyu tại Seoul | Chủ đề giải trí tạo hứng thú nói; AI giao tiếp gần gũi, tạo cảm giác như đang trò chuyện cùng bạn bè. | `아이돌`, `콘서트`, `대박`, `최애 (Bias)`, `드라마` |
| **KOR-T04** | Môi Trường Du Học | Phỏng vấn xin Visa du học & Học bổng trường Hàn | Cán bộ Đại sứ quán / Trưởng ban tuyển sinh du học | Luyện nói phong thái tự tin; hệ thống gắn nhãn đuôi câu trang trọng chuẩn mực (`-ㅂ니다 / -습니다`). | `유학`, `비자`, `대학교`, `장학금`, `자기소개` |
| **KOR-T05** | Việc Làm & Công Ty Hàn | Làm việc tại doanh nghiệp Hàn (Samsung, CJ, LG...) | Quản lý nhóm người Hàn (Team Leader - 팀장님) | Văn hóa xưng hô chức danh công sở; chỉnh sửa ngữ pháp kính ngữ chuẩn mực (`-(으)시-`). | `팀장님`, `출근`, `회의`, `보고서`, `퇴근` |
| **KOR-T06** | Cuộc Sống Du Học Sinh | Thuê phòng One-room, mở tài khoản ngân hàng tại Seoul | Môi giới bất động sản / Giao dịch viên ngân hàng | Thực hành thủ tục sinh hoạt hàng ngày; AI gợi ý câu nói đúng mẫu đời sống tại Hàn Quốc. | `원룸`, `보증금 (Tiền cọc)`, `월세`, `통장 개설` |
| **KOR-T07** | Du Lịch Khám Phá | Khám phá đảo Jeju, mặc Hanbok tại cung Gyeongbokgung | Hướng dẫn viên du lịch địa phương tại Jeju | Miêu tả cảnh quan, hỏi đường, check-in; AI hỗ trợ phát âm chuẩn giọng Seoul (SunHi TTS). | `제주도`, `한복`, `경복궁`, `사진`, `여행` |
| **KOR-T08** | Tình Huống Khẩn Cấp | Lạc đường, mất ví tiền hoặc cần hỗ trợ cảnh sát | Sĩ quan cảnh sát tại đồn cảnh sát khu vực | Học cách trình bày sự việc khẩn cấp; nút cứu cánh bí từ (Hints) cung cấp giải pháp tức thì. | `길을 잃었어요`, `지갑을 잃어버렸어요`, `도와주세요` |

---

## PHẦN 3: BẢNG TỔNG HỢP CÁC CHỈ SỐ NGHIỆM THU (METRICS & KPIS)

Để đảm bảo chất lượng đồ án tốt nghiệp xuất sắc trước Hội đồng Khoa CNTT HUTECH, các chỉ số sau đây bắt buộc phải đạt được:

| STT | Chỉ Số Đánh Giá (Metric) | Giá Trị Mục Tiêu (Target KPI) | Phương Pháp Kiểm Thử & Đo Đạc |
| :---: | :--- | :--- | :--- |
| 1 | **Độ trễ toàn trình (End-to-End Latency)** | **$\le 1.2$ giây** | Đo đạc thời gian từ khi client gửi gói audio cuối cùng qua WebSocket đến khi nhận được chunk MP3 đầu tiên từ Edge TTS. |
| 2 | **Độ chính xác nhận diện STT (Accuracy)** | **$> 90\%$** | Đánh giá trên tập mẫu phát âm của sinh viên (kể cả nói chêm tiếng Việt). |
| 3 | **Độ ổn định phân tích cú pháp JSON (Parse Rate)** | **$100\%$** | Áp dụng cơ chế ép JSON Schema (Structured Output) với Gemini 2.5 Flash SDK, loại bỏ hoàn toàn lỗi gãy UI. |
| 4 | **Thang đo mức độ khả dụng (SUS Score)** | **$> 75$ điểm** | Khảo sát thực tế 50 sinh viên tại Khoa Ngoại ngữ, Viện VJIT và Viện Việt - Hàn sau 3 ngày dùng thử. |
| 5 | **Độ bao phủ chủ đề (Topic Coverage)** | **24 Chủ đề** | 8 chủ đề tiếng Anh (Khoa Ngoại ngữ), 8 chủ đề tiếng Nhật (Viện VJIT), 8 chủ đề tiếng Hàn (Viện Việt - Hàn). |
| 6 | **Khóa luận tốt nghiệp (Thesis Documentation)** | **100 Trang chuẩn** | Soạn thảo 5 chương hoàn chỉnh theo quy định khóa luận tốt nghiệp Khoa CNTT Trường Đại học HUTECH. |
| 7 | **Đóng gói sản phẩm bàn giao (Deliverables)** | **Bản phát hành chuẩn** | USB chứa mã nguồn sạch, file cài đặt `HutechPolyAI.apk`, Slide bảo vệ và Standee mã QR dùng thử trực tiếp tại Hội đồng. |
