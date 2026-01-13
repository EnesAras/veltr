import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HERO_IMAGES } from "../../../../shared/data/products.js";

const AUTOPLAY_DELAY = 7500;
const TRANSITION_DURATION = 520;
const MIN_SWIPE_THRESHOLD = 55;
const SWIPE_THRESHOLD_FACTOR = 0.06;

function normalizeSlides() {
  return HERO_IMAGES.map((slide, index) => ({
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
  const slides = useMemo(() => normalizeSlides(), []);
  const hasSlides = slides.length > 0;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const activeIndexRef = useRef(activeIndex);
  const pointerRef = useRef({
    startX: 0,
    startY: 0,
    delta: 0,
    active: false,
    pointerId: null,
    hasNavigated: false
  });
  const pauseTimerRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const gestureTimeoutRef = useRef(null);
  const gestureLockRef = useRef(false);
  const trackRef = useRef(null);
  const heroRef = useRef(null);
  const mountedRef = useRef(true);
  const loadedMapRef = useRef({});
  const loadingPromiseRef = useRef({});

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

  const preloadImage = useCallback((url) => {
    if (!url) {
      return Promise.resolve();
    }
    if (typeof window === "undefined") {
      loadedMapRef.current[url] = true;
      return Promise.resolve();
    }
    if (loadedMapRef.current[url]) {
      return Promise.resolve();
    }
    if (loadingPromiseRef.current[url]) {
      return loadingPromiseRef.current[url];
    }
    const promise = new Promise((resolve) => {
      const img = new window.Image();
      const done = () => {
        loadedMapRef.current[url] = true;
        delete loadingPromiseRef.current[url];
        resolve();
      };
      img.onload = done;
      img.onerror = done;
      img.src = url;
      if (img.decode) {
        img
          .decode()
          .then(done)
          .catch(done);
      }
    });
    loadingPromiseRef.current[url] = promise;
    return promise;
  }, []);

  const ensureSlideReady = useCallback(
    (index) => {
      if (!hasSlides) {
        return Promise.resolve();
      }
      const slide = slides[(index + slides.length) % slides.length];
      if (!slide) {
        return Promise.resolve();
      }
      return preloadImage(slide.mediaSrc);
    },
    [hasSlides, slides, preloadImage]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    slides.forEach((slide) => {
      if (slide.mediaSrc) {
        preloadImage(slide.mediaSrc);
      }
    });
  }, [preloadImage, slides]);

  useEffect(() => {
    if (!hasSlides) {
      return;
    }
    const next = (activeIndex + 1) % slides.length;
    const prev = (activeIndex - 1 + slides.length) % slides.length;
    ensureSlideReady(next);
    ensureSlideReady(prev);
  }, [activeIndex, ensureSlideReady, hasSlides, slides.length]);

  useEffect(() => {
    if (!hasSlides || typeof window === "undefined") {
      return;
    }
    const head = window.document.head;
    const links = slides.map((slide, index) => {
      const link = window.document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = slide.mediaSrc;
      if (index === 0) {
        link.fetchPriority = "high";
      }
      head.appendChild(link);
      return link;
    });
    return () => {
      links.forEach((link) => {
        if (link.parentNode === head) {
          head.removeChild(link);
        }
      });
    };
  }, [hasSlides, slides]);

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
      ensureSlideReady(safeIndex);
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
    [activeIndex, ensureSlideReady, hasSlides, pauseAutoplay, slides.length]
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

  const finishDrag = useCallback(() => {
    if (!pointerRef.current.active) {
      return;
    }
    const { pointerId } = pointerRef.current;
    pointerRef.current.active = false;
    pointerRef.current.delta = 0;
    pointerRef.current.pointerId = null;
    pointerRef.current.hasNavigated = false;
    setIsDragging(false);
    heroRef.current?.releasePointerCapture?.(pointerId);
    releaseGestureLock();
  }, [releaseGestureLock]);

  const handlePointerDown = useCallback(
    (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }
      if (event.target instanceof Element && (event.target.closest("button") || event.target.closest("a"))) {
        return;
      }
      if (!event.defaultPrevented) {
        event.preventDefault();
      }
      pauseAutoplay();
      pointerRef.current.startX = event.clientX;
      pointerRef.current.startY = event.clientY;
      pointerRef.current.delta = 0;
      pointerRef.current.active = true;
      pointerRef.current.pointerId = event.pointerId;
      pointerRef.current.hasNavigated = false;
      setIsDragging(true);
      heroRef.current?.setPointerCapture?.(event.pointerId);
      releaseGestureLock();
    },
    [pauseAutoplay, releaseGestureLock]
  );

  const getSwipeThreshold = useCallback(() => {
    if (typeof window === "undefined") {
      return MIN_SWIPE_THRESHOLD;
    }
    const width = trackRef.current?.offsetWidth ?? window.innerWidth ?? 1024;
    return Math.max(MIN_SWIPE_THRESHOLD, width * SWIPE_THRESHOLD_FACTOR);
  }, []);

  const handlePointerMove = useCallback(
    (event) => {
      if (!pointerRef.current.active || pointerRef.current.pointerId !== event.pointerId) {
        return;
      }
      const deltaX = event.clientX - pointerRef.current.startX;
      const deltaY = event.clientY - pointerRef.current.startY;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) {
        return;
      }
      if (!event.defaultPrevented) {
        event.preventDefault();
      }
      pointerRef.current.delta = deltaX;
      if (pointerRef.current.hasNavigated) {
        return;
      }
      const threshold = getSwipeThreshold();
      if (Math.abs(deltaX) >= threshold) {
        pointerRef.current.hasNavigated = true;
        const direction = deltaX < 0 ? 1 : -1;
        engageGestureLock();
        navigateTo(activeIndexRef.current + direction, true);
        finishDrag();
      }
    },
    [engageGestureLock, finishDrag, navigateTo]
  );

  const handlePointerUp = useCallback(
    (event) => {
      if (pointerRef.current.pointerId !== event.pointerId) {
        return;
      }
      finishDrag();
    },
    [finishDrag]
  );

  const handlePointerCancel = useCallback(
    (event) => {
      if (pointerRef.current.pointerId !== event.pointerId) {
        return;
      }
      finishDrag();
    },
    [finishDrag]
  );

  const slideNodes = useMemo(
    () =>
      slides.map((slide, index) => (
        <article
          key={slide.id}
          className={`hero-apple__slide hero-apple__slide--${slide.textTheme}`}
          aria-label={slide.title}
        >
          <img
            src={slide.mediaSrc}
            alt={slide.title}
            className="hero-apple__image"
            loading="eager"
            decoding="async"
            fetchPriority={index === 0 ? "high" : "auto"}
            draggable="false"
          />
          <div className="hero-apple__content">
            <p className="hero-apple__eyebrow">{slide.eyebrow}</p>
            <h1>{slide.title}</h1>
            <p className="hero-apple__subtitle">{slide.subtitle}</p>
            <div className="hero-apple__actions">
              <button type="button" className="v-btn v-btn--ghost">
                {slide.cta}
              </button>
              <span className="hero-apple__hint">Autoplay · Muted · Infinite loop</span>
            </div>
          </div>
        </article>
      )),
    [slides]
  );

  if (!hasSlides) {
    return (
      <section className="hero-apple hero-apple--empty" aria-live="polite">
        <div className="hero-apple__placeholder" />
      </section>
    );
  }

  return (
        <section
          className={`hero-apple${isDragging ? " is-dragging" : ""}`}
          ref={heroRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
      <div
        className="hero-apple__track"
        style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
        ref={trackRef}
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
