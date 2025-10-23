
function ValidationAnimation() {
  return (
    <div className="flex justify-center items-center mt-6">
      <svg
        className="w-30 h-30 text-green-500"
        viewBox="0 0 52 52"
        fill="none"
      >
        <circle
          cx="26"
          cy="26"
          r="25"
          stroke="currentColor"
          strokeWidth="2"
          fill="#fff"
        />
        <path
          d="M14 27l7 7 17-17"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            strokeDasharray: 32,
            strokeDashoffset: 32,
            animation: "draw 0.8s forwards"
          }}
        />
        <style>
          {`
            @keyframes draw {
              to {
                stroke-dashoffset: 0;
              }
            }
          `}
        </style>
      </svg>
    </div>
  )
}

export default ValidationAnimation
