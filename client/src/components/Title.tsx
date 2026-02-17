import { useEffect, useRef } from "react";
import "../App.css";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface TitleProps {
  text?: string;
}

const Title = ({ text = "QUIZPILOT" }: TitleProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  const animateText = () => {
    let step = 0;
    const timer = setInterval(() => {
      const revealed = text.slice(0, step);
      let randomPart = "";
      for (let i = 0; i < text.length - step; i++) {
        randomPart += LETTERS[Math.floor(Math.random() * LETTERS.length)];
      }
      if (titleRef.current) {
        titleRef.current.textContent = revealed + randomPart;
      }
      step++;
      if (step > text.length) {
        clearInterval(timer);
        if (titleRef.current) {
          titleRef.current.textContent = text;
        }
      }
    }, 110);
  };

  useEffect(() => {
    animateText();
  }, [text]);

  return (
    <div className="h-64 sm:h-96 flex flex-col justify-center items-center bg-[#1A1F26] text-yellow-300">
      <h1
        id="title"
        ref={titleRef}
        className="text-4xl sm:text-6xl tracking-wider text-center font-skyfont"
      >
        {text}
      </h1>

      {/* <button
        id="reloadBtn"
        onClick={animateText}
        className="mt-3 px-3 py-2 text-md bg-[#f3eb75] rounded-lg cursor-pointer font-skyfont text-[#1A1F26]"
      >
        rejouer l'animation
      </button> */}
    </div>
  );
};

export default Title;