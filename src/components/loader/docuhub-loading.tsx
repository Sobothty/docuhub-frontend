"use client"

const DocuhubLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-24 w-24">
          <svg className="animate-spin" viewBox="0 0 50 50">
            <circle className="stroke-accent/20" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
            <circle
              className="stroke-accent animate-dash"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
              DOCUHUB
            </span>
          </h2>
        </div>

        {/* Animated Dots */}
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>

      <style jsx>{`
        @keyframes dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-dash {
          stroke-dasharray: 1, 150;
          stroke-dashoffset: 0;
          animation: dash 1.5s ease-in-out infinite;
        }

        .animate-gradient {
          animation: gradient 3s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default DocuhubLoader
