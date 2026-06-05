import React, { useEffect, useState, useRef } from 'react';
import { ArrowDown } from 'lucide-react';

export function FooterLayoutWrapper({ 
  children, 
  footerContent 
}: { 
  children: React.ReactNode;
  footerContent: React.ReactNode;
}) {
  const [isTight, setIsTight] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const wrapperHeight = wrapperRef.current.offsetHeight;
      
      // If we scroll past the wrapper's bottom boundary
      if (scrollY + windowHeight > wrapperHeight + 50) {
        setIsTight(true);
      } else {
        setIsTight(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWrapperClick = () => {
    if (isTight && wrapperRef.current) {
      window.scrollTo({
        top: Math.max(0, wrapperRef.current.offsetHeight - window.innerHeight),
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0a0a0a] flex flex-col overflow-x-hidden">
      {/* Wrapper */}
      <div 
        ref={wrapperRef}
        onClick={handleWrapperClick}
        className={`w-full bg-[var(--bg)] z-10 transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] shadow-[0_40px_100px_rgba(0,0,0,0.8)] origin-bottom relative ${
          isTight ? 'transform -translate-y-[80px] scale-[0.92] cursor-pointer rounded-b-[3rem]' : ''
        }`}
        style={{ minHeight: '100vh' }}
      >
        {children}

        {/* Floating Arrow to reveal footer */}
        <div 
           className={`absolute bottom-5 left-1/2 -translate-x-1/2 transition-opacity duration-300 ${isTight ? 'opacity-0 z-[-1]' : 'opacity-100 z-50 animate-bounce'}`}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }}
            className="w-14 h-14 bg-[var(--primary)] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
          >
            <ArrowDown size={24} />
          </button>
        </div>
      </div>

      {/* Normal Footer Flow - sits below the wrapper in layout, so when wrapper scales down, we see the body background behind it revealing the footer! */}
      <div className="w-full text-center relative z-0 mt-[-60px] pb-10">
        <div className={`transition-all duration-700 w-full ${isTight ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'}`}>
          {footerContent}
        </div>
      </div>
    </div>
  );
}
