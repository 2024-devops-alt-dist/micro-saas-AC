import { useEffect, useRef } from "react";
import "../App.css";

const FINAL_TEXT = "QUIZPILOT";
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const Title = () => {
  const titleRef = useRef<HTMLDivElement>(null);

  const animateText = () => {
    let step = 0;
    const timer = setInterval(() => {
      const revealed = FINAL_TEXT.slice(0, step);
      let randomPart = "";
      for (let i = 0; i < FINAL_TEXT.length - step; i++) {
        randomPart += LETTERS[Math.floor(Math.random() * LETTERS.length)];
      }
      if (titleRef.current) {
        titleRef.current.textContent = revealed + randomPart;
      }
      step++;
      if (step > FINAL_TEXT.length) {
        clearInterval(timer);
        if (titleRef.current) {
          titleRef.current.textContent = FINAL_TEXT;
        }
      }
    }, 110);
  };

  useEffect(() => {
    animateText();
  }, []);

  return (
    <div className="h-96 flex flex-col justify-center items-center bg-[#1A1F26] text-yellow-300 ">
      <h1
        id="title"
        ref={titleRef}
        className="text-6xl tracking-wider text-center font-skyfont"
      >
        QUIZPILOT
      </h1>
      <button
        id="reloadBtn"
        onClick={animateText}
        className="mt-3 px-3 py-2 text-md bg-[#f3eb75] rounded-lg cursor-pointer font-skyfont text-[#1A1F26]"
      >
        rejouer l'animation
      </button>
    </div>
  );
};

export default Title;