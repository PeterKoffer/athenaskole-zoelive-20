export function Slide({ 
  children, 
  className = "",
  allowVerticalScroll = false 
}: { 
  children: React.ReactNode; 
  className?: string;
  allowVerticalScroll?: boolean;
}) {
  return (
    <section
      className={`w-[100vw] h-[100dvh] shrink-0 snap-start flex flex-col ${className}`}
    >
      {allowVerticalScroll ? (
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}