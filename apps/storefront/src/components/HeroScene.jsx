import { useEffect, useRef, useState } from "react";
import { HERO_IMAGES, FALLBACK_IMAGE } from "../../../../shared/data/products.js";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function HeroScene() {
  const sceneRef = useRef(null);
  const railRef = useRef(null);
  const slideSizeRef = useRef(0);
  const startRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const pauseRef = useRef(false);
  const slides = HERO_IMAGES;
  const fallbackImage = FALLBACK_IMAGE;

  useEffect(() => {
    const updateSlideSize = () => {
      const element = railRef.current?.querySelector(".hero-carousel__slide");
      if (element) {
        const style = window.getComputedStyle(element);
        const width = element.getBoundingClientRect().width;
        const gap = parseFloat(window.getComputedStyle(railRef.current).gap) || 0;
        slideSizeRef.current = width + gap;
      }
    };

    updateSlideSize();
    window.addEventListener("resize", updateSlideSize);
    return () => window.removeEventListener("resize", updateSlideSize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sceneRef.current) {
        return;
      }
      const rect = sceneRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const usable = Math.max(rect.height - viewportHeight, 1);
      const offset = viewportHeight - rect.top;
      const rawProgress = offset / usable;
      setProgress(clamp(rawProgress, 0, 1));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const advance = () => {
      if (pauseRef.current || dragging) {
        return;
      }
      setCurrent((prev) => (prev + 1) % slides.length);
    };
    const interval = setInterval(advance, 3500);
    return () => clearInterval(interval);
  }, [dragging]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || slideSizeRef.current === 0) {
      return;
    }
    rail.scrollTo({
      left: current * slideSizeRef.current,
      behavior: dragging ? "auto" : "smooth"
    });
  }, [current, dragging]);

  const handlePointerDown = (event) => {
    setDragging(true);
    pauseRef.current = true;
    startRef.current = event.clientX;
  };

  const handlePointerMove = (event) => {
    if (!dragging || !railRef.current) {
      return;
    }
    const delta = startRef.current - event.clientX;
    railRef.current.scrollLeft += delta;
    startRef.current = event.clientX;
  };

  const handlePointerUp = (event) => {
    if (!dragging || !railRef.current) {
      return;
    }
    setDragging(false);
    pauseRef.current = false;
    const index = Math.round(railRef.current.scrollLeft / Math.max(slideSizeRef.current, 1));
    setCurrent(clamp(index, 0, slides.length - 1));
  };

  const handleScrollHintStart = () => {
    pauseRef.current = true;
  };
  const handleScrollHintEnd = () => {
    pauseRef.current = false;
  };

  const handleImageError = (event) => {
    const target = event.currentTarget;
    if (target) {
      target.onerror = null;
      target.src = fallbackImage;
    }
  };

  const goToSlide = (offset) => {
    pauseRef.current = true;
    setCurrent((value) => {
      const next = (value + offset + slides.length) % slides.length;
      return next;
    });
    setTimeout(() => {
      pauseRef.current = false;
    }, 400);
  };

  return (
    <section className="hero-scene" ref={sceneRef}>
      <div
        className="hero-sticky"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeaveCapture={handlePointerUp}
        onTouchStart={(event) => handlePointerDown(event.touches[0])}
        onTouchMove={(event) => handlePointerMove(event.touches[0])}
        onTouchEnd={(event) => handlePointerUp(event.changedTouches[0])}
      >
        <div className="hero-media">
          <div className="hero-carousel" ref={railRef}>
            {slides.map((slide) => (
              <div key={slide.id} className="hero-carousel__slide">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="hero-video"
                  onError={handleImageError}
                />
                <div className="hero-carousel__overlay" />
              </div>
            ))}
          </div>
          <button className="hero-arrow hero-arrow--left" onClick={() => goToSlide(-1)} aria-label="Previous slide">
            ‹
          </button>
          <button className="hero-arrow hero-arrow--right" onClick={() => goToSlide(1)} aria-label="Next slide">
            ›
          </button>
          <div className="hero-carousel-indicator" onMouseEnter={handleScrollHintStart} onMouseLeave={handleScrollHintEnd}>
            Drag · Swipe · Watch
          </div>
        </div>
        <div className="hero-overlay" />
        <div className="hero-copy">
          <div className="hero-copy__content">
            <p className="eyebrow hero-eyebrow" style={{ opacity: clamp(progress * 2, 0, 1) }}>
              Introducing VELTR Audio
            </p>
            <h1
              style={{
                opacity: clamp((progress - 0.03) * 4, 0, 1),
                transform: `scale(${1 + clamp((progress - 0.03) * 0.4, 0, 0.05)})`
              }}
            >
              Veltr Horizon
            </h1>
            <p
              className="lede"
              style={{
                opacity: clamp((progress - 0.2) * 2, 0, 1),
                transform: `translateY(${(1 - clamp((progress - 0.2) * 2, 0, 1)) * 10}px)`
              }}
            >
              Acoustic architecture tuned for every nuance, with carbon mesh drivers breathing detail into every note, beat, and whisper.
            </p>
            <div className="hero-actions">
              <span>Autoplay · Muted · Infinite loop</span>
              <span className="hero-scroll-indicator" style={{ opacity: clamp((progress - 0.45) * 2, 0, 1) }}>
                Scroll to explore
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
