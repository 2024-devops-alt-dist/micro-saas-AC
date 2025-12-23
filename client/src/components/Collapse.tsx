import React, { useState } from "react";

interface CollapseProps {
  title: string;
  children: React.ReactNode;
}

function Collapse({ title, children }: CollapseProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl mb-4 shadow border border-[#E6DE52] bg-[#F3EB75]">
      <button
        className={`
          w-full px-4 py-3 font-semibold text-[#1a1f26] focus:outline-none
          hover:bg-[#F8F795]
          flex flex-col items-center justify-center
          md:flex-row md:justify-between md:items-center
          ${isOpen ? "border-b-2 border-[#1a1f26]" : ""}
        `}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={`text-lg ${isOpen ? "underline" : ""}`}>{title}</span>
        <span className={`mt-2 md:mt-0 transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180 text-[#D4B900]" : "text-[#1a1f26]"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
          </svg>
        </span>
      </button>
      <div
        className={`transition-all duration-300 ${isOpen ? "max-h-[100%] opacity-100" : "max-h-0 opacity-0"} px-4`}
        style={{ borderTop: isOpen ? "2px solid #E6DE52" : "0px" }}
      >
        {isOpen && (
          <div className="py-3 text-[#1a1f26] text-base bg-[#F3EB75]">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default Collapse;