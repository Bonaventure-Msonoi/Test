(() => {
  const API_BASE = (() => {
    if (window.location.pathname.includes("/izic")) return "/izic/api";
    return "/api";
  })();

  const TOKEN_KEY = "izic_admin_token";
  const loginView = document.querySelector("[data-admin-login]");
  const appView = document.querySelector("[data-admin-app]");
  const loginForm = document.querySelector("[data-admin-login-form]");
  const loginError = document.querySelector("[data-admin-login-error]");
  const listEl = document.querySelector("[data-admin-list]");
  const detailEl = document.querySelector("[data-admin-detail]");
  const refreshBtn = document.querySelector("[data-admin-refresh]");
  const logoutBtn = document.querySelector("[data-admin-logout]");

  let token = localStorage.getItem(TOKEN_KEY) || "";
  let items = [];
  let selectedId = null;

  async function api(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || "Request failed");
      err.status = res.status;
      throw err;
    }
    return data;
  }

  function showLogin() {
    loginView.hidden = false;
    appView.hidden = true;
  }

  function showApp() {
    loginView.hidden = true;
    appView.hidden = false;
  }

  function formatDate(value) {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  }

  function renderList() {
    if (!items.length) {
      listEl.innerHTML = `<p class="admin-empty" style="padding:1rem">No registrations yet.</p>`;
      return;
    }

    listEl.innerHTML = items
      .map((item) => {
        const active = item.id === selectedId ? "is-active" : "";
        const badgeClass =
          item.status === "new"
            ? "is-new"
            : item.status === "responded"
              ? "is-responded"
              : "";
        return `
          <button type="button" class="admin-item ${active}" data-id="${item.id}">
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(item.org)} · ${escapeHtml(item.type)}</span>
            <div class="admin-meta">
              <span class="admin-badge ${badgeClass}">${escapeHtml(item.status)}</span>
              <span>${formatDate(item.createdAt)}</span>
            </div>
          </button>
        `;
      })
      .join("");
  }

  function renderDetail(item) {
    if (!item) {
      detailEl.innerHTML = `<p class="admin-empty">Select a registration to review and respond.</p>`;
      return;
    }

    const history = (item.replies || [])
      .slice()
      .reverse()
      .map(
        (reply) => `
        <article>
          <h3>${escapeHtml(reply.subject)}</h3>
          <p>${escapeHtml(reply.body)}</p>
          <small>${formatDate(reply.sentAt)}</small>
        </article>
      `
      )
      .join("");

    detailEl.innerHTML = `
      <p class="eyebrow">${escapeHtml(item.status)}</p>
      <h2>${escapeHtml(item.name)}</h2>
      <dl class="admin-detail-grid">
        <div><dt>Organisation</dt><dd>${escapeHtml(item.org)}</dd></div>
        <div><dt>Email</dt><dd><a href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a></dd></div>
        <div><dt>Country</dt><dd>${escapeHtml(item.country)}</dd></div>
        <div><dt>Type</dt><dd>${escapeHtml(item.type)}</dd></div>
        <div><dt>Submitted</dt><dd>${formatDate(item.createdAt)}</dd></div>
        <div><dt>Confirmation email</dt><dd>${formatDate(item.confirmationSentAt)}</dd></div>
      </dl>
      <p class="eyebrow">Message</p>
      <div class="admin-message">${escapeHtml(item.message || "No message provided.")}</div>
      <p class="eyebrow">Respond by email</p>
      <form class="admin-reply-form" data-reply-form>
        <label>
          Subject
          <input name="subject" required value="IZIC 2026 — Follow-up on your registration" />
        </label>
        <label>
          Message
          <textarea name="body" required placeholder="Write your official response…"></textarea>
        </label>
        <button class="btn btn-primary" type="submit">Send reply</button>
        <p class="admin-status" data-reply-status hidden></p>
      </form>
      ${
        history
          ? `<div class="admin-history"><p class="eyebrow">Previous replies</p>${history}</div>`
          : ""
      }
    `;

    const form = detailEl.querySelector("[data-reply-form]");
    const status = detailEl.querySelector("[data-reply-status]");
    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const fd = new FormData(form);
      status.hidden = false;
      status.classList.remove("is-error");
      status.textContent = "Sending…";
      try {
        const result = await api(`/admin/registrations/${item.id}/reply`, {
          method: "POST",
          body: JSON.stringify({
            subject: String(fd.get("subject") || ""),
            body: String(fd.get("body") || ""),
          }),
        });
        status.textContent = "Reply sent.";
        await loadList();
        selectedId = result.item.id;
        renderList();
        renderDetail(result.item);
      } catch (err) {
        status.classList.add("is-error");
        status.textContent = err.message || "Failed to send reply.";
      }
    });
  }

  async function loadList() {
    const data = await api("/admin/registrations");
    items = data.items || [];
  }

  async function openItem(id) {
    selectedId = id;
    renderList();
    const data = await api(`/admin/registrations/${id}`);
    renderDetail(data.item);
    await loadList();
    renderList();
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginError.hidden = true;
    const password = new FormData(loginForm).get("password");
    try {
      const data = await api("/admin/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      token = data.token;
      localStorage.setItem(TOKEN_KEY, token);
      showApp();
      await loadList();
      renderList();
      renderDetail(null);
    } catch (err) {
      loginError.hidden = false;
      loginError.textContent = err.message || "Sign-in failed.";
    }
  });

  listEl?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-id]");
    if (!btn) return;
    openItem(btn.dataset.id).catch((err) => {
      if (err.status === 401) {
        token = "";
        localStorage.removeItem(TOKEN_KEY);
        showLogin();
      }
    });
  });

  refreshBtn?.addEventListener("click", async () => {
    await loadList();
    renderList();
    if (selectedId) await openItem(selectedId);
  });

  logoutBtn?.addEventListener("click", () => {
    token = "";
    localStorage.removeItem(TOKEN_KEY);
    selectedId = null;
    items = [];
    showLogin();
  });

  (async () => {
    if (!token) {
      showLogin();
      return;
    }
    try {
      showApp();
      await loadList();
      renderList();
    } catch {
      token = "";
      localStorage.removeItem(TOKEN_KEY);
      showLogin();
    }
  })();
})();
