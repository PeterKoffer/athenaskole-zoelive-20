export default function NELIEFloating() {
  return (
    <div className="fixed bottom-4 right-4 w-24 h-24 rounded-full shadow-lg bg-white/80 backdrop-blur flex items-center justify-center hover:scale-105 transition animate-float">
      <img
        src="/nelie.png"
        alt="NELIE"
        className="w-20 h-20 object-contain"
      />
    </div>
  );
}