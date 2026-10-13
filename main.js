(() => {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const eventDate = new Date("2026-12-09T09:00:00+02:00");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobileNav = () => window.matchMedia("(max-width: 959px)").matches;
  let lastScrollY = window.scrollY;
  let scrollTicking = false;

  const syncHeader = () => {
    if (!header) return;
    const solid = header.classList.contains("is-solid");
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", solid || y > 16);

    // Mobile: hide on scroll down, show on scroll up
    if (isMobileNav() && !header.classList.contains("is-open")) {
      const delta = y - lastScrollY;
      if (y < 48) {
        header.classList.remove("is-hidden");
      } else if (delta > 8) {
        header.classList.add("is-hidden");
      } else if (delta < -6) {
        header.classList.remove("is-hidden");
      }
    } else {
      header.classList.remove("is-hidden");
    }
    lastScrollY = y;
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
    header.classList.remove("is-hidden");
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

  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        syncHeader();
        scrollTicking = false;
      });
    },
    { passive: true }
  );
  syncHeader();

  const pad = (n) => String(n).padStart(2, "0");

  const updateCountdown = () => {
    const root = document.querySelector("[data-countdown]");
    if (!root) return;

    const daysEl = root.querySelector("[data-days]");
    const hoursEl = root.querySelector("[data-hours]");
    const minsEl = root.querySelector("[data-mins]");
    const secsEl = root.querySelector("[data-secs]");
    const legacy = root.querySelector("[data-countdown-display]");
    const diff = eventDate.getTime() - Date.now();

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minsEl) minsEl.textContent = "00";
      if (secsEl) secsEl.textContent = "00";
      if (legacy) legacy.textContent = "Event live";
      root.classList.add("is-live");
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minsEl) minsEl.textContent = pad(mins);
    if (secsEl) secsEl.textContent = pad(secs);
    if (legacy) legacy.textContent = `${days}d ${hours}h ${mins}m`;
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

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

  // Animated figures — forecast cards + home statement stats
  const forecastFigures = document.querySelectorAll(
    ".target [data-count], .statement-stat [data-count], .about-card-stat [data-count], .about-card-stat strong[data-count]"
  );
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

    const cards = document.querySelectorAll(".target, .statement-stat, .about-card-stat");
    const section = document.querySelector(
      "#forecast, .section.forecast, .targets, .home-statement, .statement-stats, .about-card-stack, .about-highlight-grid"
    );

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

  // Sliding hero banners
  const heroSlider = document.querySelector("[data-hero-slider]");
  if (heroSlider) {
    const slides = [...heroSlider.querySelectorAll("[data-hero-slide]")];
    const dots = [...heroSlider.querySelectorAll("[data-hero-dot]")];
    let index = Math.max(
      0,
      slides.findIndex((slide) => slide.classList.contains("is-active"))
    );
    let timer = 0;
    const intervalMs = 6500;

    const status = heroSlider.querySelector("[data-hero-status]");

    const showSlide = (nextIndex) => {
      if (!slides.length) return;
      index = ((nextIndex % slides.length) + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === index;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });
      dots.forEach((dot, i) => {
        const active = i === index;
        dot.classList.toggle("is-active", active);
        if (active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      if (status) {
        status.textContent = `Showing banner ${index + 1} of ${slides.length}`;
      }
    };

    const stopAuto = () => {
      if (timer) window.clearInterval(timer);
      timer = 0;
    };

    const startAuto = () => {
      stopAuto();
      if (reduceMotion || slides.length < 2) return;
      timer = window.setInterval(() => showSlide(index + 1), intervalMs);
    };

    heroSlider.addEventListener("click", (event) => {
      const dot = event.target.closest("[data-hero-dot]");
      if (!dot || !heroSlider.contains(dot)) return;
      const target = Number(dot.getAttribute("data-hero-dot"));
      if (!Number.isFinite(target)) return;
      showSlide(target);
      startAuto();
    });

    heroSlider.addEventListener("mouseenter", stopAuto);
    heroSlider.addEventListener("mouseleave", startAuto);
    heroSlider.addEventListener("focusin", stopAuto);
    heroSlider.addEventListener("focusout", (event) => {
      if (!heroSlider.contains(event.relatedTarget)) startAuto();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAuto();
      else startAuto();
    });

    showSlide(index);
    startAuto();
  }

  // Registration popup
  const registerModal = document.querySelector("[data-register-modal]");
  if (registerModal) {
    const form = registerModal.querySelector("[data-register-form]");
    const note = registerModal.querySelector("[data-register-note]");
    const errorNote = registerModal.querySelector("[data-register-error]");
    const submitBtn = registerModal.querySelector("[data-register-submit]");
    const apiBase = window.location.pathname.includes("/izic")
      ? "/izic/api"
      : "/api";
    let lastFocus = null;

    const openRegister = () => {
      lastFocus = document.activeElement;
      registerModal.hidden = false;
      document.body.classList.add("register-modal-open");
      requestAnimationFrame(() => registerModal.classList.add("is-open"));
      registerModal.querySelector(".register-modal-close")?.focus();
    };

    const closeRegister = () => {
      registerModal.classList.remove("is-open");
      document.body.classList.remove("register-modal-open");
      window.setTimeout(() => {
        registerModal.hidden = true;
        if (note) {
          note.hidden = true;
          note.textContent = "";
        }
        if (errorNote) {
          errorNote.hidden = true;
          errorNote.textContent = "";
        }
        lastFocus?.focus?.();
      }, 220);
    };

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-register-open]")) {
        event.preventDefault();
        openRegister();
        return;
      }
      const link = event.target.closest('a[href="register.html"], a[href="./register.html"]');
      if (!link) return;
      event.preventDefault();
      openRegister();
    });

    registerModal.querySelectorAll("[data-register-close]").forEach((el) => {
      el.addEventListener("click", closeRegister);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !registerModal.hidden) closeRegister();
    });

    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (note) {
        note.hidden = true;
        note.textContent = "";
      }
      if (errorNote) {
        errorNote.hidden = true;
        errorNote.textContent = "";
      }

      const fd = new FormData(form);
      const payload = {
        name: String(fd.get("name") || "").trim(),
        org: String(fd.get("org") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        country: String(fd.get("country") || "").trim(),
        type: String(fd.get("type") || "").trim(),
        message: String(fd.get("message") || "").trim(),
        website: String(fd.get("website") || "").trim(),
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting…";
      }

      try {
        const res = await fetch(`${apiBase}/registrations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            data.error ||
              "Unable to submit your request right now. Please try again or email izic@zda.org.zm."
          );
        }
        form.reset();
        if (note) {
          note.hidden = false;
          note.textContent =
            data.message ||
            "Your request has been submitted. You will receive an official email within 24 working hours.";
        }
      } catch (err) {
        if (errorNote) {
          errorNote.hidden = false;
          errorNote.textContent =
            err.message ||
            "Unable to submit your request right now. Please try again or email izic@zda.org.zm.";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit interest";
        }
      }
    });

    if (document.body.dataset.page === "register") {
      openRegister();
    }
  }
})();

