import { useEffect, useState } from "react";
import "../App.css";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface TitleProps {
  text?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Title = ({ text = "QUIZPILOT", tag = "h1" }: TitleProps) => {
  const [displayedText, setDisplayedText] = useState(text);
  const Tag = tag as any;

  useEffect(() => {
    let step = 0;
    const intervalTime = 50;

    const timer = setInterval(() => {
      const revealed = text.slice(0, step);
      let randomPart = "";
      for (let i = 0; i < text.length - step; i++) {
        randomPart += LETTERS[Math.floor(Math.random() * LETTERS.length)];
      }

      setDisplayedText(revealed + randomPart);

      step++;
      if (step > text.length) {
        clearInterval(timer);
        setDisplayedText(text);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <div className="h-64 sm:h-96 flex flex-col justify-center items-center bg-[#1A1F26] text-yellow-300 antialiased overflow-hidden">
      <Tag className="text-4xl sm:text-6xl tracking-wider text-center font-skyfont select-none min-h-[1.5em] leading-relaxed">
        {displayedText}
      </Tag>
    </div>
  );
};


export default Title;