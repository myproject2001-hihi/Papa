import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Gift, SkipForward } from "lucide-react";

interface LetterProps {
  onComplete?: () => void;
  onNextStep: () => void;
}

const PARAGRAPHS = [
  { text: "Hello papa,", isSignature: false },
  { 
    text: "Tính ra tới nay đã tròn 1 tháng sanh nhật của papa rồi nhỉ ?? 3 tháng hè này bên con bận quá, đủ thứ chuyện nên cả chuyện con làm luận văn lẫn chuyện con đã hứa vs papa con chưa làm nữa....Ba chờ tháng này...con sẽ quay lại vs papa nhe 👉👈", 
    isSignature: false 
  },
  { 
    text: "Xả vai cái nè 😤😤...tuổi mới rồi...nhận lớp dạy tụi nhỏ đàng hoàng è...ko dạy tụi nhỏ làm mấy chiện tầm xàm nữa nhe...lo cho tụi nhỏ thì lo cho bản thân mình ii nhe...giữ sức khỏe...kiếm zợ nữa chớ...tròn chĩnh 25 tuổi dòi", 
    isSignature: false 
  },
  { 
    text: "Zới lại sau khi m nhấn nút là có 1 món quà cho mài...mong là món quà này hỗ trợ cho m trong việc giảng dạy..có thể đi thi GV giỏi nhe 🫢🫢 món quà vậy hoi chớ vẫn chưa hoàn thiện đến mức con mong muốn nên là có gì papa có xài thì cho con feedback nhó...con sẽ cải thiện ổn áp nhứccc nhức cái léck", 
    isSignature: false 
  },
  { text: "P.S. Votre fille adorée", isSignature: true }
];

export function TypewriterLetter({ onNextStep }: LetterProps) {
  const [completedParagraphs, setCompletedParagraphs] = useState<string[]>([]);
  const [currentParaIndex, setCurrentParaIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Typewriter effect logic
  useEffect(() => {
    if (isFinished) return;

    if (currentParaIndex >= PARAGRAPHS.length) {
      setIsFinished(true);
      return;
    }

    const targetText = PARAGRAPHS[currentParaIndex].text;

    if (currentCharIndex < targetText.length) {
      const timeout = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, 35); // 35ms per character for realistic typing

      return () => clearTimeout(timeout);
    } else {
      // Paragraph complete, wait a bit before starting next paragraph
      const delay = PARAGRAPHS[currentParaIndex].isSignature ? 300 : 500;
      const timeout = setTimeout(() => {
        setCompletedParagraphs((prev) => [...prev, targetText]);
        setCurrentParaIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentParaIndex, currentCharIndex, isFinished]);

  const handleSkip = () => {
    setCompletedParagraphs(PARAGRAPHS.map((p) => p.text));
    setIsFinished(true);
  };

  const currentlyTypingText = 
    !isFinished && currentParaIndex < PARAGRAPHS.length 
      ? PARAGRAPHS[currentParaIndex].text.slice(0, currentCharIndex)
      : "";

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 md:p-16 shadow-xl shadow-[#4A3B32]/5 rounded-sm border border-[#E8DCC4] relative">
        <div className="absolute top-4 left-4 text-4xl text-[#E8DCC4] font-serif">"</div>
        
        {!isFinished && (
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 flex items-center gap-1 text-xs text-[#8C6B5D]/70 hover:text-[#8C6B5D] transition-colors font-serif px-2 py-1 rounded bg-[#FDFBF7]"
            title="Xem toàn bộ thư"
          >
            <span>Đọc nhanh</span>
            <SkipForward size={12} />
          </button>
        )}

        <div className="space-y-6 text-lg md:text-xl leading-relaxed text-[#4A3B32] font-sans min-h-[320px]">
          {/* Completed Paragraphs */}
          {completedParagraphs.map((text, idx) => {
            const isSig = PARAGRAPHS[idx]?.isSignature;
            return (
              <p
                key={idx}
                className={isSig ? "pt-8 font-script text-3xl md:text-4xl text-[#C17767] text-right whitespace-pre-line" : "whitespace-pre-line"}
              >
                {text}
              </p>
            );
          })}

          {/* Currently Typing Paragraph */}
          {!isFinished && currentParaIndex < PARAGRAPHS.length && (
            <p
              className={
                PARAGRAPHS[currentParaIndex].isSignature
                  ? "pt-8 font-script text-3xl md:text-4xl text-[#C17767] text-right whitespace-pre-line"
                  : "whitespace-pre-line"
              }
            >
              {currentlyTypingText}
              <span className="inline-block w-0.5 h-5 bg-[#C17767] ml-1 animate-pulse vertical-middle" />
            </p>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isFinished ? 1 : 0.4, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center pt-4"
      >
        <button
          onClick={onNextStep}
          disabled={!isFinished}
          className={`px-8 py-3 bg-white border border-[#C17767] text-[#C17767] rounded-full font-serif flex items-center gap-2 transition-all shadow-sm ${
            isFinished
              ? "hover:bg-[#FCF5EB] cursor-pointer scale-100"
              : "opacity-50 cursor-not-allowed scale-95"
          }`}
        >
          <Gift size={18} />
          <span>Món quà cuối cùng</span>
        </button>
      </motion.div>
    </div>
  );
}
