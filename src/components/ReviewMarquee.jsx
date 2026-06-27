import { useCallback, useEffect, useRef, useState } from 'react';

const ReviewMarquee = ({ items }) => {
  const trackRef = useRef(null);
  const positionRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, position: 0 });
  const rafRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const duplicated = [...items, ...items];

  const loopPosition = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    if (half <= 0) return;
    while (positionRef.current <= -half) positionRef.current += half;
    while (positionRef.current > 0) positionRef.current -= half;
  }, []);

  useEffect(() => {
    const tick = () => {
      if (!isDraggingRef.current) {
        positionRef.current -= 0.85;
        loopPosition();
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${positionRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loopPosition]);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, position: positionRef.current };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    positionRef.current = dragStartRef.current.position + (e.clientX - dragStartRef.current.x);
    loopPosition();
  };

  const endDrag = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={trackRef}
      className={`flex w-max gap-5 sm:gap-6 px-4 sm:px-6 select-none touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{ willChange: 'transform' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="region"
      aria-label="Customer reviews carousel. Drag to scroll."
    >
      {duplicated.map((review, index) => (
        <article
          key={`${review.id}-${index}`}
          className="shrink-0 w-[300px] sm:w-[360px] lg:w-[400px] rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/90 p-6 sm:p-7 shadow-md shadow-slate-900/5"
        >
          <div className="flex gap-0.5 text-[#e53935] text-sm mb-4" aria-label={`${review.rating} out of 5 stars`}>
            {'★'.repeat(review.rating)}
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-[15px] leading-relaxed mb-5">
            &ldquo;{review.text}&rdquo;
          </p>
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{review.name}</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">{review.role}</p>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ReviewMarquee;
