import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HERO_IMAGES } from "../../../../shared/data/products.js";

const AUTOPLAY_DELAY = 7500;
const TRANSITION_DURATION = 520;
const DRAG_THRESHOLD_FACTOR = 0.1;
const IMAGE_WIDTHS = [1200, 1600, 2000];

const getImageBase = (src) => (src ? src.replace(/\.(png|jpe?g)$/i, "") : "");
const buildSrcSet = (src, format) => {
  const base = getImageBase(src);
  if (!base) {
    return "";
  }
  return IMAGE_WIDTHS.map((width) => `${base}-${width}.${format} ${width}w`).join(", ");
};
const buildFallbackSrc = (src) => {
  const base = getImageBase(src);
  return base ? `${base}-1600.jpg` : src;
};

function normalizeSlides(source) {
  return source.map((slide, index) => ({
    id: slide.id ?? `hero-${index}`,
    mediaSrc: slide.image ?? slide.src ?? slide.url ?? "",
    eyebrow: slide.eyebrow ?? "Introducing VELTR Audio",
    title: slide.title ?? "Veltr Horizon",
    subtitle:
      slide.subtitle ??
      slide.description ??
      "Acoustic architecture tuned for every nuance, with carbon mesh drivers breathing detail into every note.",
    cta: slide.cta ?? "Discover",
    textTheme: slide.textTheme ?? "light"
  }));
}

export default function HeroCarouselApple() {
  const slides = useMemo(() => normalizeSlides(HERO_IMAGES), [HERO_IMAGES]);
  const supportsPointerEvents = typeof window !== "undefined" && "PointerEvent" in window;
  const hasSlides = slides.length > 0;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const activeIndexRef = useRef(activeIndex);
  const warnedSlidesRef = useRef(new Set());
  const pointerRef = useRef({
    startX: 0,
    startY: 0,
    delta: 0,
    active: false,
    pointerId: null,
    source: null,
    startIndex: 0
  });
  const pauseTimerRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const gestureTimeoutRef = useRef(null);
  const gestureLockRef = useRef(false);
  const trackRef = useRef(null);
  const heroRef = useRef(null);
  const mountedRef = useRef(true);
  const windowListenerRef = useRef({ mouse: null, touch: null, pointer: null });
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      if (gestureTimeoutRef.current) {
        clearTimeout(gestureTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const pauseAutoplay = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }
    setIsPlaying(false);
    if (typeof window === "undefined") {
      return;
    }
    pauseTimerRef.current = window.setTimeout(() => {
      if (mountedRef.current) {
        setIsPlaying(true);
      }
    }, AUTOPLAY_DELAY);
  }, []);

  const navigateTo = useCallback(
    (index, manual = false) => {
      if (!hasSlides || slides.length < 1) {
        console.warn("HeroCarousel: no slides to navigate");
        return;
      }
      const safeIndex = ((index % slides.length) + slides.length) % slides.length;
      if (safeIndex === activeIndex) {
        return;
      }
      if (manual) {
        pauseAutoplay();
      }
      setIsTransitioning(true);
      setActiveIndex(safeIndex);
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      if (typeof window !== "undefined") {
        transitionTimerRef.current = window.setTimeout(() => {
          if (mountedRef.current) {
            setIsTransitioning(false);
          }
        }, TRANSITION_DURATION);
      } else {
        setIsTransitioning(false);
      }
    },
    [activeIndex, hasSlides, pauseAutoplay, slides.length]
  );

  const goTo = useCallback(
    (index) => {
      navigateTo(index, true);
    },
    [navigateTo]
  );
  const next = useCallback(() => {
    navigateTo(activeIndex + 1, true);
  }, [activeIndex, navigateTo]);
  const prev = useCallback(() => {
    navigateTo(activeIndex - 1, true);
  }, [activeIndex, navigateTo]);

  useEffect(() => {
    if (!isPlaying || slides.length < 2) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    const interval = window.setInterval(() => {
      navigateTo(activeIndex + 1);
    }, AUTOPLAY_DELAY);
    return () => {
      window.clearInterval(interval);
    };
  }, [activeIndex, isPlaying, navigateTo, slides.length]);

  const releaseGestureLock = useCallback(() => {
    if (gestureTimeoutRef.current) {
      clearTimeout(gestureTimeoutRef.current);
      gestureTimeoutRef.current = null;
    }
    gestureLockRef.current = false;
  }, []);

  const engageGestureLock = useCallback(
    (duration = 400) => {
      if (gestureTimeoutRef.current) {
        clearTimeout(gestureTimeoutRef.current);
      }
      gestureLockRef.current = true;
      if (typeof window === "undefined") {
        return;
      }
      gestureTimeoutRef.current = window.setTimeout(() => {
        gestureLockRef.current = false;
        gestureTimeoutRef.current = null;
      }, duration);
    },
    []
  );

  const resetDrag = useCallback(() => {
    if (!pointerRef.current.active) {
      return;
    }
    const { pointerId } = pointerRef.current;
    pointerRef.current.active = false;
    pointerRef.current.delta = 0;
    pointerRef.current.pointerId = null;
    pointerRef.current.source = null;
    pointerRef.current.startIndex = 0;
    setIsDragging(false);
    trackRef.current?.releasePointerCapture?.(pointerId);
    windowListenerRef.current.mouse?.();
    windowListenerRef.current.touch?.();
    windowListenerRef.current.pointer?.();
    releaseGestureLock();
  }, [releaseGestureLock]);

  useEffect(() => {
    return () => {
      windowListenerRef.current.mouse?.();
      windowListenerRef.current.touch?.();
      windowListenerRef.current.pointer?.();
    };
  }, []);

  function addWindowMouseListeners() {
    if (typeof window === "undefined" || windowListenerRef.current.mouse) {
      return;
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: false });
    window.addEventListener("mouseup", handleMouseUp);
    windowListenerRef.current.mouse = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      windowListenerRef.current.mouse = null;
    };
  }

  function addWindowTouchListeners() {
    if (typeof window === "undefined" || windowListenerRef.current.touch) {
      return;
    }
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);
    windowListenerRef.current.touch = () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      windowListenerRef.current.touch = null;
    };
  }

  function addWindowPointerListeners() {
    if (typeof window === "undefined" || windowListenerRef.current.pointer) {
      return;
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);
    windowListenerRef.current.pointer = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
      windowListenerRef.current.pointer = null;
    };
  }

  const getX = useCallback((event) => event.touches?.[0]?.clientX ?? event.clientX, []);

  const getY = useCallback((event) => event.touches?.[0]?.clientY ?? event.clientY, []);

  const handlePointerDown = useCallback(
    (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }
      if (pointerRef.current.active) {
        return;
      }
      if (event.target instanceof Element && (event.target.closest("button") || event.target.closest("a"))) {
        return;
      }
      if (!event.defaultPrevented) {
        event.preventDefault();
      }
      pauseAutoplay();
      pointerRef.current.startX = getX(event);
      pointerRef.current.startY = getY(event);
      pointerRef.current.delta = 0;
      pointerRef.current.active = true;
      pointerRef.current.pointerId = event.pointerId;
      pointerRef.current.source = "pointer";
      pointerRef.current.startIndex = activeIndexRef.current;
      setIsDragging(true);
      const target = event.currentTarget;
      target?.setPointerCapture?.(event.pointerId);
      const hasCapture = target?.hasPointerCapture?.(event.pointerId) ?? false;
      if (!hasCapture) {
        addWindowPointerListeners();
      }
      releaseGestureLock();
    },
    [addWindowPointerListeners, getX, getY, pauseAutoplay, releaseGestureLock]
  );

  const getDragThreshold = useCallback(() => {
    const width = trackRef.current?.offsetWidth ?? window.innerWidth ?? 1024;
    return width * DRAG_THRESHOLD_FACTOR;
  }, []);

  const handlePointerMove = useCallback(
    (event) => {
      if (
        !pointerRef.current.active ||
        pointerRef.current.source !== "pointer" ||
        pointerRef.current.pointerId !== event.pointerId
      ) {
        return;
      }
      const deltaX = getX(event) - pointerRef.current.startX;
      const deltaY = getY(event) - pointerRef.current.startY;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) {
        return;
      }
      if (!event.defaultPrevented) {
        event.preventDefault();
      }
      pointerRef.current.delta = deltaX;
    },
    [getX, getY]
  );

  const handlePointerUp = useCallback(
    (event) => {
      if (
        pointerRef.current.source !== "pointer" ||
        pointerRef.current.pointerId !== event.pointerId
      ) {
        return;
      }
      const deltaX = pointerRef.current.delta;
      const threshold = getDragThreshold();
      if (Math.abs(deltaX) >= threshold) {
        engageGestureLock();
        if (deltaX < 0) {
          next();
        } else {
          prev();
        }
      }
      resetDrag();
    },
    [engageGestureLock, getDragThreshold, next, prev, resetDrag]
  );

  const handlePointerCancel = useCallback(
    (event) => {
      if (
        pointerRef.current.source !== "pointer" ||
        pointerRef.current.pointerId !== event.pointerId
      ) {
        return;
      }
      resetDrag();
    },
    [resetDrag]
  );

  const handleMouseDown = useCallback(
    (event) => {
      if (supportsPointerEvents) {
        return;
      }
      if (event.button !== 0) {
        return;
      }
      if (pointerRef.current.active) {
        return;
      }
      if (event.target instanceof Element && (event.target.closest("button") || event.target.closest("a"))) {
        return;
      }
      if (!event.defaultPrevented) {
        event.preventDefault();
      }
      pauseAutoplay();
      pointerRef.current.startX = getX(event);
      pointerRef.current.startY = getY(event);
      pointerRef.current.delta = 0;
      pointerRef.current.active = true;
      pointerRef.current.pointerId = "mouse";
      pointerRef.current.source = "mouse";
      pointerRef.current.startIndex = activeIndexRef.current;
      setIsDragging(true);
      addWindowMouseListeners();
      releaseGestureLock();
    },
    [addWindowMouseListeners, getX, getY, pauseAutoplay, releaseGestureLock, supportsPointerEvents]
  );

  const handleMouseMove = useCallback(
    (event) => {
      if (supportsPointerEvents) {
        return;
      }
      if (
        !pointerRef.current.active ||
        pointerRef.current.source !== "mouse" ||
        pointerRef.current.pointerId !== "mouse"
      ) {
        return;
      }
      const deltaX = getX(event) - pointerRef.current.startX;
      const deltaY = getY(event) - pointerRef.current.startY;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) {
        return;
      }
      if (!event.defaultPrevented) {
        event.preventDefault();
      }
      pointerRef.current.delta = deltaX;
    },
    [getX, getY, supportsPointerEvents]
  );

  const handleMouseUp = useCallback(
    (event) => {
      if (supportsPointerEvents) {
        return;
      }
      if (
        pointerRef.current.source !== "mouse" ||
        pointerRef.current.pointerId !== "mouse"
      ) {
        return;
      }
      const deltaX = pointerRef.current.delta;
      const threshold = getDragThreshold();
      if (Math.abs(deltaX) >= threshold) {
        engageGestureLock();
        if (deltaX < 0) {
          next();
        } else {
          prev();
        }
      }
      resetDrag();
    },
    [engageGestureLock, getDragThreshold, next, prev, resetDrag, supportsPointerEvents]
  );

  const handleTouchStart = useCallback(
    (event) => {
      if (supportsPointerEvents) {
        return;
      }
      if (pointerRef.current.active) {
        return;
      }
      if (event.target instanceof Element && (event.target.closest("button") || event.target.closest("a"))) {
        return;
      }
      if (event.touches.length !== 1) {
        return;
      }
      pauseAutoplay();
      pointerRef.current.startX = getX(event);
      pointerRef.current.startY = getY(event);
      pointerRef.current.delta = 0;
      pointerRef.current.active = true;
      pointerRef.current.pointerId = event.touches[0]?.identifier ?? "touch";
      pointerRef.current.source = "touch";
      pointerRef.current.startIndex = activeIndexRef.current;
      setIsDragging(true);
      addWindowTouchListeners();
      releaseGestureLock();
    },
    [addWindowTouchListeners, getX, getY, pauseAutoplay, releaseGestureLock, supportsPointerEvents]
  );

  const handleTouchMove = useCallback(
    (event) => {
      if (supportsPointerEvents) {
        return;
      }
      if (!pointerRef.current.active || pointerRef.current.source !== "touch") {
        return;
      }
      const deltaX = getX(event) - pointerRef.current.startX;
      const deltaY = getY(event) - pointerRef.current.startY;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) {
        return;
      }
      if (!event.defaultPrevented) {
        event.preventDefault();
      }
      pointerRef.current.delta = deltaX;
    },
    [getX, getY, supportsPointerEvents]
  );

  const handleTouchEnd = useCallback(
    () => {
      if (supportsPointerEvents) {
        return;
      }
      if (!pointerRef.current.active || pointerRef.current.source !== "touch") {
        return;
      }
      const deltaX = pointerRef.current.delta;
      const threshold = getDragThreshold();
      if (Math.abs(deltaX) >= threshold) {
        engageGestureLock();
        if (deltaX < 0) {
          next();
        } else {
          prev();
        }
      }
      resetDrag();
    },
    [engageGestureLock, getDragThreshold, next, prev, resetDrag, supportsPointerEvents]
  );

  useEffect(() => {
    const node = heroRef.current;
    if (!node || typeof window === "undefined") {
      return;
    }
    let wheelDeltaX = 0;
    let wheelLock = false;
    const onWheel = (event) => {
      if (wheelLock || pointerRef.current.active) {
        return;
      }
      const { deltaX, deltaY } = event;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) {
        return;
      }
      event.preventDefault();
      wheelDeltaX += deltaX;
      const threshold = getDragThreshold();
      if (Math.abs(wheelDeltaX) >= threshold) {
        if (wheelDeltaX > 0) {
          next();
        } else {
          prev();
        }
        wheelDeltaX = 0;
        wheelLock = true;
        window.setTimeout(() => {
          wheelLock = false;
        }, 350);
      }
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      node.removeEventListener("wheel", onWheel);
    };
  }, [getDragThreshold, next, prev]);


  const slideNodes = useMemo(
    () =>
      slides.map((slide, index) => {
        if (process.env.NODE_ENV !== "production") {
          const warningKey = slide.id ?? `slide-${index}`;
          if ((!slide.mediaSrc || !slide.title) && !warnedSlidesRef.current.has(warningKey)) {
            console.warn("HeroCarousel: slide missing title or mediaSrc", {
              id: slide.id,
              mediaSrc: slide.mediaSrc,
              title: slide.title
            });
            warnedSlidesRef.current.add(warningKey);
          }
        }
        const isActive = index === activeIndex;
        return (
          <article
            key={slide.id}
            className={`hero-apple__slide hero-apple__slide--${slide.textTheme}`}
            aria-label={slide.title}
          >
            <picture>
              <source type="image/avif" srcSet={buildSrcSet(slide.mediaSrc, "avif")} sizes="100vw" />
              <source type="image/webp" srcSet={buildSrcSet(slide.mediaSrc, "webp")} sizes="100vw" />
              <img
                src={buildFallbackSrc(slide.mediaSrc)}
                alt={slide.title}
                className="hero-apple__image"
                loading={isActive ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={isActive ? "high" : "auto"}
                draggable="false"
                width="4997"
                height="3331"
              />
            </picture>
            <div className="hero-apple__content">
              <p className="hero-apple__eyebrow">{slide.eyebrow}</p>
              <h1>{slide.title}</h1>
              <p className="hero-apple__subtitle">{slide.subtitle}</p>
              <div className="hero-apple__actions">
                <button type="button" className="v-btn v-btn--ghost hero-apple__cta">
                  {slide.cta}
                </button>
                <span className="hero-apple__hint">Autoplay · Muted · Infinite loop</span>
              </div>
            </div>
          </article>
        );
      }),
    [activeIndex, slides]
  );

  if (!hasSlides) {
    return (
      <section className="hero-apple hero-apple--empty" aria-live="polite">
        <div className="hero-apple__placeholder" />
      </section>
    );
  }

  return (
    <section className={`hero-apple${isDragging ? " is-dragging" : ""}`} ref={heroRef}>
      <div
        className="hero-apple__track"
        style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
        ref={trackRef}
        onPointerDown={supportsPointerEvents ? handlePointerDown : undefined}
        onPointerMove={supportsPointerEvents ? handlePointerMove : undefined}
        onPointerUp={supportsPointerEvents ? handlePointerUp : undefined}
        onPointerCancel={supportsPointerEvents ? handlePointerCancel : undefined}
        onMouseDown={supportsPointerEvents ? undefined : handleMouseDown}
        onTouchStart={supportsPointerEvents ? undefined : handleTouchStart}
      >
        {slideNodes}
      </div>
      <div className="hero-apple__nav">
        <button type="button" onClick={prev} aria-label="Previous slide">
          ‹
        </button>
        <button type="button" onClick={next} aria-label="Next slide">
          ›
        </button>
      </div>
      <div className="hero-apple__dots">
        {slides.map((_, index) => (
          <button
            key={`dot-${index}`}
            className={`hero-apple__dot ${index === activeIndex ? "is-active" : ""}`}
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
