import { AnimatePresence, motion } from "motion/react";
import { Heart, Image as ImageIcon, Mail, Music, Play, Pause, Gift, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { TypewriterLetter } from "./components/TypewriterLetter";
import photo1 from "./assets/images/photo1.jpg";
import photo2 from "./assets/images/photo2.jpg";
import photo3 from "./assets/images/photo3.jpg";
import photo4 from "./assets/images/photo4.jpg";
import photo5 from "./assets/images/photo5.jpg";
import photo6 from "./assets/images/photo6.jpg";
import photo7 from "./assets/images/photo7.jpg";
import photo8 from "./assets/images/photo8.jpg";

const DEFAULT_MEMORIES = [
  { id: 0, img: photo1, caption: "1 lớp cho 1 tuổi mới<br>của ông ba" },
  { id: 1, img: photo2, caption: "1 hành trình vung đắp<br>1 thế hệ Việt Nam" },
  { id: 2, img: photo3, caption: "Zui zẻ cùng bầy con thơ" },
  { id: 3, img: photo4, caption: "Kho vàng kho bạc<br>của ông ba nè" },
  { id: 4, img: photo5, caption: "Tiết học zui zẻ - giữ nụ cừi nì<br>cho lớp học mới nho" },
  { id: 5, img: photo6, caption: "Aaaa chú lân mổ mấy cục zàng<br>của papa kiàaaa" },
  { id: 6, img: photo7, caption: "Papa à, xây lại profile<br>cho năm mới nào" },
  { id: 7, img: photo8, caption: "Tiếp tục giữ nụ cừi nì<br>cho năm tuổi mới nào" },
];

export default function App() {
  const [step, setStep] = useState<"envelope" | "gallery" | "letter" | "surprise">("envelope");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [memories] = useState(DEFAULT_MEMORIES);
  const ytIframeRef = useRef<HTMLIFrameElement>(null);

  // Clear any legacy localStorage items to ensure all devices display bundled memories
  useEffect(() => {
    try {
      localStorage.removeItem("user_custom_memories_v2");
    } catch (e) {
      // ignore
    }
  }, []);

  const YOUTUBE_VIDEO_ID = "h53q6iIORhw";

  const playAudio = () => {
    if (ytIframeRef.current?.contentWindow) {
      ytIframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: "" }),
        "*"
      );
    }
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    if (ytIframeRef.current?.contentWindow) {
      ytIframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
        "*"
      );
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "gallery" && isAutoPlay) {
      timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % memories.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [step, isAutoPlay, memories.length]);

  useEffect(() => {
    if (step === "surprise") {
      const fireConfetti = () => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ["#C17767", "#E8DCC4", "#FCF5EB", "#8C6B5D"]
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ["#C17767", "#E8DCC4", "#FCF5EB", "#8C6B5D"]
        });
      };

      // Bắn 1 lần lúc vừa mở
      fireConfetti();
      
      // Bắn thêm 1 lần nữa sau 800ms để tạo điểm nhấn nhưng không bị rối
      const timeout = setTimeout(fireConfetti, 800);

      return () => clearTimeout(timeout);
    }
  }, [step]);

  const handleOpen = () => {
    setStep("gallery");
    playAudio();
  };

  const toggleAudio = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A3B32] font-sans selection:bg-[#E8DCC4] overflow-x-hidden">
      {/* Hidden YouTube Audio Player */}
      <iframe
        ref={ytIframeRef}
        src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&autoplay=0&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0`}
        title="Background Music - Happy Birthday To You"
        allow="autoplay"
        className="hidden pointer-events-none w-0 h-0 opacity-0 absolute"
      />

      {/* Floating Audio Control (shown after opening) */}
      <AnimatePresence>
        {step !== "envelope" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2"
          >
            <motion.button
              onClick={toggleAudio}
              title={isPlaying ? "Tạm dừng nhạc: Happy Birthday to You" : "Bật nhạc: Happy Birthday to You"}
              className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-[#E8DCC4] text-[#8C6B5D] hover:text-[#4A3B32] hover:bg-white transition-all flex items-center justify-center"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-24">
        <AnimatePresence mode="wait">
          {/* STEP 1: ENVELOPE */}
          {step === "envelope" && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-12"
            >
              <div className="space-y-4">
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl italic text-[#2C241E]">
                  Gửi đến Papa...
                </h1>
                <p className="text-[#8C6B5D] font-serif text-base sm:text-lg">
                  Một bức thư nho nhỏ<br />mang theo nhiều kỉ niệm<br />của 1 tuổi mới nhó
                </p>
              </div>

              <button
                onClick={handleOpen}
                className="group relative flex flex-col items-center gap-4 transition-transform hover:scale-105 active:scale-95"
              >
                <motion.div
                  animate={{ scale: [1, 1.08, 1, 1.05, 1] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#E8DCC4] text-[#C17767] group-hover:bg-[#FCF5EB] transition-colors"
                >
                  <Mail size={32} strokeWidth={1.5} />
                </motion.div>
                <span className="font-serif uppercase tracking-widest text-sm text-[#8C6B5D]">
                  Mở thư
                </span>
              </button>
            </motion.div>
          )}

          {/* STEP 2: THE GALLERY (SLIDESHOW) */}
          {step === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <Music className="mx-auto text-[#C17767] opacity-50 mb-2" size={24} />
                <h2 className="font-serif text-3xl italic text-[#2C241E]">Ký Ức Đẹp...</h2>
                <div className="w-12 h-[1px] bg-[#C17767] mx-auto"></div>
                <p className="text-[#8C6B5D] font-serif text-sm md:text-base">
                  Chậm lại một nhịp để nhìn lại những khoảng khoảnh quý giá nhé
                </p>
              </div>

              {/* Main Photo Polaroid Card */}
              <div className="relative w-full max-w-xl mx-auto bg-white p-4 md:p-6 pb-6 md:pb-8 shadow-xl border border-[#E8DCC4] flex flex-col items-center transition-transform duration-500 ease-out rounded-sm group">
                
                {/* Image Navigation Arrows */}
                <button
                  onClick={() => {
                    setIsAutoPlay(false);
                    setCurrentImageIndex((prev) => (prev === 0 ? memories.length - 1 : prev - 1));
                  }}
                  aria-label="Ảnh trước"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 shadow-md border border-[#E8DCC4] text-[#8C6B5D] hover:text-[#4A3B32] hover:bg-white transition-all"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={() => {
                    setIsAutoPlay(false);
                    setCurrentImageIndex((prev) => (prev + 1) % memories.length);
                  }}
                  aria-label="Ảnh tiếp theo"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 shadow-md border border-[#E8DCC4] text-[#8C6B5D] hover:text-[#4A3B32] hover:bg-white transition-all"
                >
                  <ChevronRight size={22} />
                </button>

                {/* Slideshow Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.6 }}
                    className="w-full flex flex-col items-center"
                  >
                    <div className="relative w-full h-[280px] sm:h-[360px] md:h-[400px] overflow-hidden rounded-sm bg-[#F5EFE6] flex items-center justify-center">
                      {/* Blurred background layer so background matches photo colors without blank bars */}
                      <img 
                        src={memories[currentImageIndex]?.img} 
                        alt="" 
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110 pointer-events-none" 
                      />
                      {/* Main full image (object-contain ensures complete photo is visible without cropping) */}
                      <img 
                        src={memories[currentImageIndex]?.img} 
                        alt={memories[currentImageIndex]?.caption} 
                        className="relative z-0 max-w-full max-h-full object-contain transition-transform duration-700 hover:scale-[1.02] drop-shadow-sm" 
                      />

                      {/* Hidden upload overlay for clean viewing */}
                    </div>

                    <div className="w-full pt-3 md:pt-6 pb-2 px-2 text-center min-h-[75px] md:min-h-[85px] flex items-center justify-center">
                      <p 
                        className="font-script text-lg sm:text-2xl md:text-3xl font-bold text-[#8C6B5D] tracking-wide leading-relaxed whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: (memories[currentImageIndex]?.caption || "").replace(/\n/g, "<br>") }}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Navigation Dots */}
                <div className="absolute -bottom-8 left-0 right-0 flex justify-center items-center gap-2">
                  {memories.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => {
                        setIsAutoPlay(false);
                        setCurrentImageIndex(idx);
                      }}
                      className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-6 bg-[#C17767]' : 'w-2.5 bg-[#E8DCC4] hover:bg-[#C17767]/50'}`}
                      title={`Kỷ niệm ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Upload Helper & Controls Bar */}
              <div className="pt-4 flex flex-wrap justify-center items-center gap-3 text-sm text-[#8C6B5D] font-serif">
                <span className="bg-[#FCF5EB] px-3 py-1 rounded-full border border-[#E8DCC4] text-xs">
                  Ảnh {currentImageIndex + 1} / {memories.length}
                </span>

                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className="px-3 py-1 rounded-full bg-white border border-[#E8DCC4] hover:bg-[#FCF5EB] transition-colors text-xs flex items-center gap-1"
                >
                  {isAutoPlay ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isAutoPlay ? "Tạm dừng chiếu" : "Tự động chiếu"}</span>
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="flex justify-center pt-6"
              >
                <button
                  onClick={() => setStep("letter")}
                  className="px-8 py-3 bg-[#4A3B32] text-white rounded-full font-serif flex items-center gap-2 hover:bg-[#2C241E] transition-colors shadow-sm"
                >
                  <span>Đọc thư của con nhóe</span>
                  <BookOpen size={18} />
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 3: THE LETTER */}
          {step === "letter" && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <TypewriterLetter onNextStep={() => setStep("surprise")} />
            </motion.div>
          )}

          {/* STEP 4: SURPRISE */}
          {step === "surprise" && (
            <motion.div
              key="surprise"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Heart className="text-[#C17767] fill-[#C17767]/20" size={64} strokeWidth={1} />
              </motion.div>

              <div className="space-y-6 max-w-lg">
                <h2 className="font-script text-4xl sm:text-5xl text-[#C17767]">Điều Bất Ngờ...</h2>
                <p className="text-base sm:text-lg md:text-xl font-serif text-[#4A3B32] leading-relaxed">
                  "Món quà lớn nhất mà con cho papa nhó<br />Chúc papa có 1 năm học đầy niềm zui zui zui và<br />cùng con Vươn mình kỉ nguyên số nhó"
                </p>
                <a
                  href="https://eduteach-web.onrender.com/" // Thay link bí mật của bạn vào đây
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-white p-5 md:p-6 rounded-sm shadow-md border border-[#E8DCC4] hover:border-[#C17767] hover:shadow-lg transition-all duration-300 mt-6 inline-flex items-center gap-3 cursor-pointer hover:-translate-y-1"
                >
                  <p className="text-xs sm:text-sm md:text-base text-[#8C6B5D] group-hover:text-[#C17767] italic transition-colors font-medium">
                    Hãy cùng con là 1 người tiêu dùng chất lượng nào!
                  </p>
                  <Gift size={18} className="text-[#C17767] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all shrink-0" />
                </a>
              </div>

              <button
                onClick={() => {
                  setStep("envelope");
                  setCurrentImageIndex(0);
                }}
                className="text-sm text-[#8C6B5D] underline hover:text-[#4A3B32] transition-colors pt-12"
              >
                Đọc lại từ đầu
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
