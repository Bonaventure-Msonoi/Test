(() => {
  // Flip cards
  document.querySelectorAll("[data-flip-card]").forEach((card) => {
    const toggle = () => {
      const open = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(open));
    };
    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
  });

  // Content popup modal (news, projects, travel, speakers, stories)
  const modal = document.querySelector("[data-card-modal]");
  if (modal) {
    const imageEl = modal.querySelector("[data-card-image]");
    const metaEl = modal.querySelector("[data-card-meta]");
    const titleEl = modal.querySelector("[data-card-title]");
    const bodyEl = modal.querySelector("[data-card-body]");
    const mediaWrap = modal.querySelector("[data-card-media]");
    let lastFocus = null;

    const fillModal = (id) => {
      const template = document.getElementById(`card-data-${id}`);
      if (!template) return false;
      const meta = template.content.querySelector("[data-meta]")?.textContent || "";
      const title = template.content.querySelector("[data-title]")?.textContent || "";
      const image = template.content.querySelector("[data-image]")?.textContent?.trim() || "";
      const body = template.content.querySelector("[data-body]");
      if (metaEl) metaEl.textContent = meta;
      if (titleEl) titleEl.textContent = title;
      if (imageEl) {
        if (image) {
          imageEl.hidden = false;
          imageEl.src = image;
          imageEl.alt = title;
          if (mediaWrap) mediaWrap.hidden = false;
        } else {
          imageEl.removeAttribute("src");
          imageEl.hidden = true;
          if (mediaWrap) mediaWrap.hidden = true;
        }
      }
      if (bodyEl) bodyEl.innerHTML = body ? body.innerHTML : "";
      return true;
    };

    const openCard = (id, { updateHash = true } = {}) => {
      if (!fillModal(id)) return;
      lastFocus = document.activeElement;
      modal.hidden = false;
      document.body.classList.add("story-modal-open");
      requestAnimationFrame(() => modal.classList.add("is-open"));
      if (updateHash) history.replaceState(null, "", `#${id}`);
      modal.querySelector(".story-modal-close")?.focus();
    };

    const closeCard = ({ clearHash = true } = {}) => {
      modal.classList.remove("is-open");
      document.body.classList.remove("story-modal-open");
      window.setTimeout(() => {
        modal.hidden = true;
        if (bodyEl) bodyEl.innerHTML = "";
        if (imageEl) imageEl.removeAttribute("src");
        if (clearHash && location.hash) {
          history.replaceState(null, "", location.pathname + location.search);
        }
        lastFocus?.focus?.();
      }, 220);
    };

    document.querySelectorAll("[data-card-open]").forEach((trigger) => {
      trigger.addEventListener("click", () => openCard(trigger.getAttribute("data-card-open")));
    });
    modal.querySelectorAll("[data-card-close]").forEach((el) => {
      el.addEventListener("click", () => closeCard());
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) closeCard();
    });

    const hashId = location.hash.replace("#", "");
    if (hashId && document.getElementById(`card-data-${hashId}`)) {
      openCard(hashId, { updateHash: false });
    }
  }

  // YouTube video modal
  const videoModal = document.querySelector("[data-video-modal]");
  if (videoModal) {
    const frame = videoModal.querySelector("[data-video-frame]");
    let lastFocus = null;

    const openVideo = (id) => {
      if (!id || !frame) return;
      lastFocus = document.activeElement;
      frame.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      videoModal.hidden = false;
      document.body.classList.add("story-modal-open");
      requestAnimationFrame(() => videoModal.classList.add("is-open"));
      videoModal.querySelector(".story-modal-close")?.focus();
    };

    const closeVideo = () => {
      videoModal.classList.remove("is-open");
      document.body.classList.remove("story-modal-open");
      window.setTimeout(() => {
        videoModal.hidden = true;
        if (frame) frame.src = "";
        lastFocus?.focus?.();
      }, 220);
    };

    document.querySelectorAll("[data-video-open]").forEach((trigger) => {
      trigger.addEventListener("click", () => openVideo(trigger.getAttribute("data-video-open")));
    });
    videoModal.querySelectorAll("[data-video-close]").forEach((el) => {
      el.addEventListener("click", closeVideo);
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !videoModal.hidden) closeVideo();
    });
  }
})();
