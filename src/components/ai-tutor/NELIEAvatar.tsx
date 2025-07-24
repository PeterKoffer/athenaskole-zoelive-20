interface NELIEAvatarProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  isActive?: boolean;
  isSpeaking?: boolean;
  className?: string;
}

const NELIEAvatar = ({ 
  size = "md", 
  isSpeaking = false, 
  className = "" 
}: NELIEAvatarProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
    "2xl": "w-40 h-40",
    "3xl": "w-60 h-60",
    "4xl": "w-80 h-80"
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-300 relative ${className}`}>
      <img 
        src="/nelie.png"
        alt="NELIE AI Tutor"
        className={`${sizeClasses[size]} object-contain`}
        draggable={false}
      />
      
      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute top-[65%] left-[55%] transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-cyan-400 rounded-full animate-pulse opacity-95 shadow-lg shadow-cyan-400/60"></div>
        </div>
      )}
    </div>
  );
};

export default NELIEAvatar;