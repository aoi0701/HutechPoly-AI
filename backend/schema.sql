-- =============================================================================
-- DỰ ÁN KHÓA LUẬN TỐT NGHIỆP CNTT - HUTECHPOLY-AI
-- HỆ THỐNG LUYỆN PHẢN XẠ HỘI THOẠI ĐA NGỮ (ANH - NHẬT - HÀN) - ĐH HUTECH
-- Tệp tin cấu trúc cơ sở dữ liệu (Database Schema) chuẩn PostgreSQL cho Supabase
-- =============================================================================

-- Kích hoạt tiện ích mở rộng tạo khóa chính ngẫu nhiên UUID và mã hóa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. BẢNG NGƯỜI DÙNG (users)
-- Quản trị hồ sơ sinh viên, hỗ trợ email cá nhân đăng ký với trường (không giới hạn đuôi)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ràng buộc kiểm tra định dạng email hợp lệ theo chuẩn quốc tế
    CONSTRAINT ck_users_valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

COMMENT ON TABLE public.users IS 'Bảng lưu trữ thông tin tài khoản người dùng và sinh viên luyện tập';
COMMENT ON COLUMN public.users.id IS 'Khóa chính định danh duy nhất của người dùng dạng UUID';
COMMENT ON COLUMN public.users.email IS 'Địa chỉ email duy nhất của sinh viên (chấp nhận email cá nhân đăng ký với trường)';
COMMENT ON COLUMN public.users.full_name IS 'Họ và tên đầy đủ của sinh viên';
COMMENT ON COLUMN public.users.avatar_url IS 'Đường dẫn ảnh đại diện của sinh viên';
COMMENT ON COLUMN public.users.created_at IS 'Thời điểm tạo tài khoản sinh viên';
COMMENT ON COLUMN public.users.updated_at IS 'Thời điểm cập nhật thông tin gần nhất';

-- =============================================================================
-- 2. BẢNG DANH MỤC CHỦ ĐỀ ĐÀM THOẠI (topics)
-- Quản trị 24 chủ đề phản xạ phân bổ cho 3 Khoa/Viện (Anh - Nhật - Hàn)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_code VARCHAR(50) UNIQUE NOT NULL,
    language VARCHAR(10) NOT NULL,
    faculty TEXT NOT NULL,
    level VARCHAR(20) NOT NULL,
    title_vi TEXT NOT NULL,
    title_native TEXT NOT NULL,
    category TEXT NOT NULL,
    ai_persona TEXT NOT NULL,
    opening_line TEXT NOT NULL,
    system_instruction TEXT,
    key_vocab JSONB NOT NULL DEFAULT '[]'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ràng buộc kiểm tra ngôn ngữ và cấp độ hợp lệ
    CONSTRAINT ck_topics_language CHECK (language IN ('en', 'ja', 'ko')),
    CONSTRAINT ck_topics_level CHECK (level IN ('easy', 'medium', 'hard'))
);

COMMENT ON TABLE public.topics IS 'Bảng lưu trữ danh mục 24 chủ đề phản xạ đàm thoại theo bối cảnh';
COMMENT ON COLUMN public.topics.topic_code IS 'Mã định danh nghiệp vụ duy nhất (ví dụ: ENG-T01, JPN-T01, KOR-T01)';
COMMENT ON COLUMN public.topics.language IS 'Mã ngôn ngữ mục tiêu (en: Tiếng Anh, ja: Tiếng Nhật, ko: Tiếng Hàn)';
COMMENT ON COLUMN public.topics.faculty IS 'Khoa hoặc Viện phụ trách chuyên môn tại Đại học HUTECH';
COMMENT ON COLUMN public.topics.level IS 'Độ khó của chủ đề (easy: Dễ, medium: Vừa, hard: Nâng cao)';
COMMENT ON COLUMN public.topics.title_vi IS 'Tên chủ đề được dịch nghĩa sang tiếng Việt';
COMMENT ON COLUMN public.topics.title_native IS 'Tên chủ đề viết bằng ngôn ngữ bản xứ (Anh, Nhật, Hàn)';
COMMENT ON COLUMN public.topics.category IS 'Phân nhóm chủ đề (Đời sống, Ẩm thực, Học thuật HUTECH, Phỏng vấn...)';
COMMENT ON COLUMN public.topics.ai_persona IS 'Mô tả vai diễn và tính cách của AI khi đối thoại với sinh viên';
COMMENT ON COLUMN public.topics.opening_line IS 'Câu chào mở đầu dẫn dắt phiên hội thoại của AI';
COMMENT ON COLUMN public.topics.system_instruction IS 'Lời chỉ dẫn hệ thống định hình hành vi và ngữ cảnh cho Gemini 2.5 Flash';
COMMENT ON COLUMN public.topics.key_vocab IS 'Dữ liệu JSONB chứa danh sách từ vựng trọng tâm (kèm IPA, Furigana ruby, hoặc Romaja)';
COMMENT ON COLUMN public.topics.metadata IS 'Thông tin bổ trợ mở rộng cho chủ đề';
COMMENT ON COLUMN public.topics.is_active IS 'Trạng thái kích hoạt cho phép sinh viên luyện tập';

-- =============================================================================
-- 3. BẢNG PHIÊN LUYỆN TẬP (sessions)
-- Ghi nhận mỗi lần sinh viên truy cập phòng thoại Voice Room để luyện một chủ đề
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INT NOT NULL DEFAULT 0,
    total_turns INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'in_progress',
    feedback_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ràng buộc trạng thái phiên luyện tập
    CONSTRAINT ck_sessions_status CHECK (status IN ('in_progress', 'completed', 'abandoned'))
);

COMMENT ON TABLE public.sessions IS 'Bảng ghi nhận từng phiên luyện tập thoại giữa sinh viên và AI';
COMMENT ON COLUMN public.sessions.user_id IS 'Khóa ngoại liên kết tới người dùng thực hiện phiên';
COMMENT ON COLUMN public.sessions.topic_id IS 'Khóa ngoại liên kết tới chủ đề được lựa chọn luyện tập';
COMMENT ON COLUMN public.sessions.started_at IS 'Thời điểm bắt đầu phiên luyện thoại';
COMMENT ON COLUMN public.sessions.ended_at IS 'Thời điểm kết thúc phiên luyện thoại';
COMMENT ON COLUMN public.sessions.duration_seconds IS 'Tổng thời lượng đàm thoại tính bằng giây';
COMMENT ON COLUMN public.sessions.total_turns IS 'Tổng số lượt đối đáp qua lại trong phiên';
COMMENT ON COLUMN public.sessions.status IS 'Trạng thái phiên: in_progress (đang diễn ra), completed (hoàn thành), abandoned (hủy giữa chừng)';
COMMENT ON COLUMN public.sessions.feedback_summary IS 'Tổng kết nhận xét tổng quan trình độ sau khi kết thúc phiên';

-- =============================================================================
-- 4. BẢNG LỊCH SỬ LƯỢT THOẠI (chat_turns)
-- Lưu chi tiết từng câu nói của sinh viên, bản dịch, nhận xét ngữ pháp và phản hồi AI
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.chat_turns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    turn_number INT NOT NULL,
    speaker VARCHAR(20) NOT NULL,
    user_audio_url TEXT,
    user_transcript TEXT,
    ai_response TEXT,
    vi_translation TEXT,
    grammar_feedback TEXT,
    vocabulary_hints JSONB NOT NULL DEFAULT '[]'::jsonb,
    suggested_replies JSONB NOT NULL DEFAULT '[]'::jsonb,
    latency_ms INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ràng buộc người nói hợp lệ
    CONSTRAINT ck_chat_turns_speaker CHECK (speaker IN ('user', 'ai'))
);

COMMENT ON TABLE public.chat_turns IS 'Bảng lưu trữ lịch sử chi tiết từng lượt nói chuyện (turn-by-turn)';
COMMENT ON COLUMN public.chat_turns.session_id IS 'Khóa ngoại trỏ đến phiên hội thoại tương ứng';
COMMENT ON COLUMN public.chat_turns.turn_number IS 'Số thứ tự lượt đối đáp trong phiên (1, 2, 3...)';
COMMENT ON COLUMN public.chat_turns.speaker IS 'Vai trò người nói (user: sinh viên, ai: trợ lý ảo Gemini)';
COMMENT ON COLUMN public.chat_turns.user_audio_url IS 'Đường dẫn file ghi âm giọng nói người dùng trên Cloud Storage (nếu có)';
COMMENT ON COLUMN public.chat_turns.user_transcript IS 'Nội dung nhận diện giọng nói (STT) chuyển thành văn bản';
COMMENT ON COLUMN public.chat_turns.ai_response IS 'Nội dung câu nói phản hồi của AI bằng ngoại ngữ mục tiêu';
COMMENT ON COLUMN public.chat_turns.vi_translation IS 'Bản dịch đối chiếu câu AI sang tiếng Việt';
COMMENT ON COLUMN public.chat_turns.grammar_feedback IS 'Nhận xét và chỉ ra lỗi ngữ pháp khi sinh viên nói chêm tiếng Việt hoặc sai cấu trúc';
COMMENT ON COLUMN public.chat_turns.vocabulary_hints IS 'Mảng JSONB chứa từ vựng cứu cánh (hints)';
COMMENT ON COLUMN public.chat_turns.suggested_replies IS 'Mảng JSONB gợi ý 2 cách phản xạ tiếp theo cho sinh viên';
COMMENT ON COLUMN public.chat_turns.latency_ms IS 'Độ trễ toàn trình xử lý lượt thoại tính bằng mili-giây (ms)';

-- =============================================================================
-- 5. BẢNG SỔ TAY LỖI SAI (mistakes_log)
-- Thu thập tất cả lỗi ngữ pháp/phát âm/bí từ để phục vụ tính năng "Luyện nói lại câu này"
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.mistakes_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    original_sentence TEXT NOT NULL,
    corrected_sentence TEXT NOT NULL,
    error_type VARCHAR(100) NOT NULL DEFAULT 'grammar',
    explanation TEXT,
    language VARCHAR(10) NOT NULL,
    is_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ràng buộc loại lỗi và ngôn ngữ
    CONSTRAINT ck_mistakes_error_type CHECK (error_type IN ('grammar', 'pronunciation', 'bilingual_mix', 'vocabulary', 'honorific', 'other')),
    CONSTRAINT ck_mistakes_language CHECK (language IN ('en', 'ja', 'ko'))
);

COMMENT ON TABLE public.mistakes_log IS 'Sổ tay lưu vết các lỗi sai của sinh viên để ôn tập và luyện lại';
COMMENT ON COLUMN public.mistakes_log.user_id IS 'Khóa ngoại liên kết đến sinh viên mắc lỗi';
COMMENT ON COLUMN public.mistakes_log.session_id IS 'Khóa ngoại liên kết đến phiên luyện tập phát sinh lỗi';
COMMENT ON COLUMN public.mistakes_log.topic_id IS 'Khóa ngoại liên kết đến chủ đề đang luyện';
COMMENT ON COLUMN public.mistakes_log.original_sentence IS 'Câu nói ban đầu của sinh viên (có thể chứa tiếng Việt hoặc cấu trúc sai)';
COMMENT ON COLUMN public.mistakes_log.corrected_sentence IS 'Mẫu câu chuẩn ngoại ngữ tự nhiên được AI sửa lại';
COMMENT ON COLUMN public.mistakes_log.error_type IS 'Phân loại lỗi (ngữ pháp, phát âm, chêm tiếng Việt, từ vựng, kính ngữ)';
COMMENT ON COLUMN public.mistakes_log.explanation IS 'Giải thích cặn kẽ vì sao sai và cách dùng đúng ngữ cảnh';
COMMENT ON COLUMN public.mistakes_log.language IS 'Ngôn ngữ của bài học (en, ja, ko)';
COMMENT ON COLUMN public.mistakes_log.is_reviewed IS 'Đánh dấu sinh viên đã ôn tập lại câu này trong sổ tay hay chưa';

-- =============================================================================
-- 6. TỐI ƯU HÓA CHỈ MỤC TRUY VẤN (INDEXES)
-- Tối ưu tốc độ truy xuất cho màn hình Topic Grid, Dashboard và Sổ tay lỗi sai
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_topics_language_level ON public.topics (language, level);
CREATE INDEX IF NOT EXISTS idx_topics_is_active ON public.topics (is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_topic_id ON public.sessions (topic_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON public.sessions (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_turns_session_id ON public.chat_turns (session_id);
CREATE INDEX IF NOT EXISTS idx_chat_turns_turn_number ON public.chat_turns (session_id, turn_number);
CREATE INDEX IF NOT EXISTS idx_mistakes_log_user_id ON public.mistakes_log (user_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_log_topic_id ON public.mistakes_log (topic_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_log_is_reviewed ON public.mistakes_log (user_id, is_reviewed);

-- =============================================================================
-- 7. HÀM VÀ TRIGGER TỰ ĐỘNG CẬP NHẬT THỜI GIAN (updated_at)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 8. BẢO MẬT DỮ LIỆU CẤP DÒNG (ROW LEVEL SECURITY - RLS)
-- Đảm bảo mỗi sinh viên chỉ được xem và chỉnh sửa dữ liệu cá nhân của mình
-- =============================================================================

-- Kích hoạt RLS trên tất cả các bảng
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_turns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistakes_log ENABLE ROW LEVEL SECURITY;

-- --- Chính sách cho bảng topics (Chủ đề) ---
-- Mọi sinh viên (kể cả chưa đăng nhập) đều được phép đọc danh mục chủ đề để xem trước
DROP POLICY IF EXISTS "Cho phép mọi người đọc danh mục chủ đề" ON public.topics;
CREATE POLICY "Cho phép mọi người đọc danh mục chủ đề"
ON public.topics FOR SELECT
USING (is_active = TRUE);

-- --- Chính sách cho bảng users (Người dùng) ---
-- Sinh viên được quyền xem hồ sơ của chính mình
DROP POLICY IF EXISTS "Sinh viên xem thông tin cá nhân của mình" ON public.users;
CREATE POLICY "Sinh viên xem thông tin cá nhân của mình"
ON public.users FOR SELECT
USING (auth.uid() = id);

-- Sinh viên được quyền cập nhật hồ sơ cá nhân của mình
DROP POLICY IF EXISTS "Sinh viên cập nhật thông tin cá nhân của mình" ON public.users;
CREATE POLICY "Sinh viên cập nhật thông tin cá nhân của mình"
ON public.users FOR UPDATE
USING (auth.uid() = id);

-- --- Chính sách cho bảng sessions (Phiên luyện tập) ---
-- Sinh viên chỉ xem các phiên luyện tập do mình tạo ra
DROP POLICY IF EXISTS "Sinh viên xem danh sách phiên luyện tập của mình" ON public.sessions;
CREATE POLICY "Sinh viên xem danh sách phiên luyện tập của mình"
ON public.sessions FOR SELECT
USING (auth.uid() = user_id);

-- Sinh viên được phép tạo mới phiên luyện tập
DROP POLICY IF EXISTS "Sinh viên tạo mới phiên luyện tập" ON public.sessions;
CREATE POLICY "Sinh viên tạo mới phiên luyện tập"
ON public.sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Sinh viên được cập nhật trạng thái phiên của mình
DROP POLICY IF EXISTS "Sinh viên cập nhật phiên luyện tập của mình" ON public.sessions;
CREATE POLICY "Sinh viên cập nhật phiên luyện tập của mình"
ON public.sessions FOR UPDATE
USING (auth.uid() = user_id);

-- --- Chính sách cho bảng chat_turns (Lịch sử lượt thoại) ---
-- Sinh viên chỉ xem lượt thoại thuộc phiên của mình
DROP POLICY IF EXISTS "Sinh viên xem lượt thoại thuộc phiên của mình" ON public.chat_turns;
CREATE POLICY "Sinh viên xem lượt thoại thuộc phiên của mình"
ON public.chat_turns FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.sessions s
        WHERE s.id = chat_turns.session_id AND s.user_id = auth.uid()
    )
);

-- Sinh viên được ghi thêm lượt thoại vào phiên của mình
DROP POLICY IF EXISTS "Sinh viên thêm lượt thoại vào phiên của mình" ON public.chat_turns;
CREATE POLICY "Sinh viên thêm lượt thoại vào phiên của mình"
ON public.chat_turns FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.sessions s
        WHERE s.id = chat_turns.session_id AND s.user_id = auth.uid()
    )
);

-- --- Chính sách cho bảng mistakes_log (Sổ tay lỗi sai) ---
-- Sinh viên chỉ xem sổ tay lỗi sai của chính mình
DROP POLICY IF EXISTS "Sinh viên xem sổ tay lỗi sai của mình" ON public.mistakes_log;
CREATE POLICY "Sinh viên xem sổ tay lỗi sai của mình"
ON public.mistakes_log FOR SELECT
USING (auth.uid() = user_id);

-- Sinh viên được lưu lỗi sai mới vào sổ tay của mình
DROP POLICY IF EXISTS "Sinh viên lưu lỗi sai vào sổ tay" ON public.mistakes_log;
CREATE POLICY "Sinh viên lưu lỗi sai vào sổ tay"
ON public.mistakes_log FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Sinh viên được đánh dấu đã ôn tập câu sai trong sổ tay của mình
DROP POLICY IF EXISTS "Sinh viên đánh dấu ôn tập lỗi sai" ON public.mistakes_log;
CREATE POLICY "Sinh viên đánh dấu ôn tập lỗi sai"
ON public.mistakes_log FOR UPDATE
USING (auth.uid() = user_id);
