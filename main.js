(() => {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const countdownDisplay = document.querySelector("[data-countdown-display]");
  const eventDate = new Date("2026-12-09T09:00:00+02:00");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const syncHeader = () => {
    if (!header) return;
    const solid = header.classList.contains("is-solid");
    header.classList.toggle("is-scrolled", solid || window.scrollY > 16);
  };

  // Letter-stagger hero title (anime.js / portfolio greeting style)
  const splitHeroTitle = () => {
    const title = document.querySelector("[data-letter-animate]");
    if (!title || title.dataset.split === "true") return;

    const text = title.textContent.trim();
    title.dataset.split = "true";
    title.setAttribute("aria-label", text);
    title.textContent = "";

    text.split(" ").forEach((word, wordIndex, words) => {
      const wordEl = document.createElement("span");
      wordEl.className = "word";
      [...word].forEach((char, charIndex) => {
        const letter = document.createElement("span");
        letter.className = "letter";
        letter.textContent = char;
        letter.style.animationDelay = `${wordIndex * 90 + charIndex * 38 + 180}ms`;
        wordEl.appendChild(letter);
      });
      title.appendChild(wordEl);
      if (wordIndex < words.length - 1) {
        title.appendChild(document.createTextNode(" "));
      }
    });

    requestAnimationFrame(() => title.classList.add("is-animated"));
  };

  if (!reduceMotion) splitHeroTitle();
  else document.querySelector("[data-letter-animate]")?.classList.add("is-animated");

  // Button ripple (portfolio-style feedback)
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".btn-primary, .btn-secondary");
    if (!btn || reduceMotion) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    ripple.className = "btn-ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 700);
  });

  const closeMobileNav = () => {
    if (!header || !toggle || !mobileNav) return;
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    mobileNav.hidden = true;
    document.body.classList.remove("nav-locked");
  };

  const openMobileNav = () => {
    if (!header || !toggle || !mobileNav) return;
    header.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    mobileNav.hidden = false;
    document.body.classList.add("nav-locked");
  };

  toggle?.addEventListener("click", () => {
    const open = !header.classList.contains("is-open");
    if (open) openMobileNav();
    else closeMobileNav();
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 960) closeMobileNav();
  });

  window.addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();

  const updateCountdown = () => {
    if (!countdownDisplay) return;
    const now = Date.now();
    const diff = eventDate.getTime() - now;

    if (diff <= 0) {
      countdownDisplay.textContent = "Event live";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    countdownDisplay.textContent = `${days}d ${hours}h`;
  };

  updateCountdown();
  window.setInterval(updateCountdown, 60_000);

  const formatCount = (value, el) => {
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const decimals = Number(el.dataset.decimals || 0);
    const format = el.dataset.format || "";
    let core;

    if (decimals > 0) {
      core = value.toFixed(decimals);
    } else {
      core = String(Math.round(value));
    }

    if (format === "comma") {
      core = Number(core).toLocaleString("en-US");
    }

    return `${prefix}${core}${suffix}`;
  };

  const animateCount = (el) => {
    if (el.dataset.counted === "true") return;
    el.dataset.counted = "true";

    const end = Number(el.dataset.count);
    if (!Number.isFinite(end)) return;

    if (reduceMotion) {
      el.textContent = formatCount(end, el);
      return;
    }

    const duration = 1600;
    const start = performance.now();
    el.textContent = formatCount(0, el);

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(end * eased, el);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = formatCount(end, el);
      }
    };

    requestAnimationFrame(tick);
  };

  const isInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < viewH - 24 && rect.bottom > 24;
  };

  // "From promotion to transactions" figures — observe each card, not the
  // opacity-0 wrapper (that pattern often fails on mobile Safari).
  const forecastFigures = document.querySelectorAll(".target [data-count]");
  forecastFigures.forEach((el) => {
    if (!reduceMotion) el.textContent = formatCount(0, el);
  });

  const startForecastCounts = () => {
    const block = document.querySelector(".targets");
    if (block) block.classList.add("is-visible");
    forecastFigures.forEach((el) => animateCount(el));
  };

  const watchForecast = () => {
    if (!forecastFigures.length) return;

    const cards = document.querySelectorAll(".target");
    const section = document.querySelector("#forecast, .section.forecast, .targets");

    if ("IntersectionObserver" in window) {
      const countObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            startForecastCounts();
            countObserver.disconnect();
          }
        },
        { threshold: 0.15, rootMargin: "80px 0px 80px 0px" }
      );

      cards.forEach((card) => countObserver.observe(card));
      if (section) countObserver.observe(section);

      if ([...cards].some(isInViewport) || (section && isInViewport(section))) {
        startForecastCounts();
        countObserver.disconnect();
      }

      const rescueCounts = () => {
        if ([...forecastFigures].every((el) => el.dataset.counted === "true")) {
          return;
        }
        if ([...cards].some(isInViewport) || (section && isInViewport(section))) {
          startForecastCounts();
          countObserver.disconnect();
        }
      };

      window.addEventListener("scroll", rescueCounts, { passive: true });
      window.addEventListener("touchmove", rescueCounts, { passive: true });
      window.addEventListener("resize", rescueCounts, { passive: true });
    } else {
      startForecastCounts();
    }
  };

  watchForecast();

  const staggerSelectors = [
    ".link-tiles",
    ".path-rail",
    ".targets",
    ".benefit-list",
    ".sector-grid",
    ".story-grid",
    ".speaker-grid",
    ".story-card-grid",
    ".partner-logos",
  ];

  staggerSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add("stagger-in");
    });
  });

  const applyStaggerDelays = (el) => {
    const kids = el.querySelectorAll(":scope > *");
    kids.forEach((child, index) => {
      child.style.transitionDelay = `${Math.min(index * 90, 720)}ms`;
    });
  };

  const revealTargets = document.querySelectorAll(
    ".section-head, .targets, .benefit-list, .sector-grid, .story-grid, .news-list, .about-grid, .partner-inner, .awards-inner, .partner-logos, .contact-grid, .link-tiles, .path-rail, .home-statement, .prose-grid, .speaker-grid, .schedule-list, .package-grid, .hotel-grid, .project-sections, .photo-grid, .pub-grid, .register-grid, .year-block, .story-card-grid, [data-reveal]"
  );

  const reveal = (el) => {
    if (el.classList.contains("stagger-in")) applyStaggerDelays(el);
    el.classList.add("is-visible");
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: [0, 0.05, 0.15], rootMargin: "40px 0px 40px 0px" }
    );

    revealTargets.forEach((el) => {
      if (isInViewport(el)) reveal(el);
      else observer.observe(el);
    });

    const rescue = () => {
      revealTargets.forEach((el) => {
        if (el.classList.contains("is-visible")) return;
        if (isInViewport(el)) {
          reveal(el);
          observer.unobserve(el);
        }
      });
    };

    window.addEventListener("scroll", rescue, { passive: true });
    window.addEventListener("touchmove", rescue, { passive: true });
  } else {
    revealTargets.forEach((el) => reveal(el));
  }
})();

