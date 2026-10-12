(() => {
  const modal = document.querySelector("[data-story-modal]");
  if (!modal) return;

  const imageEl = modal.querySelector("[data-story-image]");
  const metaEl = modal.querySelector("[data-story-meta]");
  const titleEl = modal.querySelector("[data-story-title]");
  const bodyEl = modal.querySelector("[data-story-body]");
  const closeEls = modal.querySelectorAll("[data-story-close]");
  let lastFocus = null;

  const alias = {
    yash: "yash",
    maamba: "maamba",
    bibagry: "bibagry",
    "bibagry-2021": "bibagry-2021",
  };

  const fillModal = (id) => {
    const template = document.getElementById(`story-data-${id}`);
    if (!template) return false;

    const meta = template.content.querySelector("[data-meta]")?.textContent || "";
    const title = template.content.querySelector("[data-title]")?.textContent || "";
    const image = template.content.querySelector("[data-image]")?.textContent || "";
    const body = template.content.querySelector("[data-body]");

    metaEl.textContent = meta;
    titleEl.textContent = title;
    imageEl.src = image.trim();
    imageEl.alt = title;
    bodyEl.innerHTML = body ? body.innerHTML : "";
    return true;
  };

  const openStory = (id, { updateHash = true } = {}) => {
    const key = alias[id];
    if (!key || !fillModal(key)) return;

    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("story-modal-open");
    requestAnimationFrame(() => modal.classList.add("is-open"));

    if (updateHash) {
      history.replaceState(null, "", `#${key === "bibagry-2021" ? "bibagry" : key}`);
    }

    modal.querySelector(".story-modal-close")?.focus();
  };

  const closeStory = ({ clearHash = true } = {}) => {
    modal.classList.remove("is-open");
    document.body.classList.remove("story-modal-open");

    const finish = () => {
      modal.hidden = true;
      imageEl.removeAttribute("src");
      bodyEl.innerHTML = "";
      if (clearHash && location.hash) {
        history.replaceState(null, "", location.pathname + location.search);
      }
      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
    };

    window.setTimeout(finish, 220);
  };

  document.querySelectorAll("[data-story-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openStory(trigger.getAttribute("data-story-open"));
    });
  });

  closeEls.forEach((el) => {
    el.addEventListener("click", () => closeStory());
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeStory();
    }
  });

  const hashId = location.hash.replace("#", "").toLowerCase();
  if (hashId && alias[hashId]) {
    openStory(hashId, { updateHash: false });
  }
})();
