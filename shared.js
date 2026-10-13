(() => {
  const page = document.body.dataset.page || "home";
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  const navItems = [
    { label: "About", href: "about.html" },
    { label: "Schedule", href: "schedule.html" },
    { label: "Speakers", href: "speakers.html" },
    { label: "Projects", href: "projects.html" },
    { label: "Partnership", href: "partnership.html" },
    { label: "News", href: "news.html" },
    {
      label: "Invest",
      children: [
        { label: "Priority Sectors", href: "sectors.html" },
        { label: "Investment Incentives", href: "incentives.html" },
        { label: "Registering a Business", href: "business.html" },
        { label: "Success Stories", href: "stories.html" },
      ],
    },
    {
      label: "Media",
      children: [
        { label: "Photo Gallery", href: "gallery.html" },
        { label: "Videos", href: "videos.html" },
        { label: "Presidential Awards", href: "awards.html" },
      ],
    },
    {
      label: "Travel",
      children: [
        { label: "Hotels & Lodges", href: "travel.html" },
        { label: "Route / Map", href: "map.html" },
        { label: "Travel & Visas", href: "visas.html" },
        { label: "Tourism Packages", href: "tourism.html" },
      ],
    },
    { label: "Contact", href: "contact.html" },
  ];

  const isActive = (href) => href.toLowerCase() === current;

  const groupActive = (item) =>
    item.children?.some((child) => isActive(child.href)) ?? false;

  const desktopNav = navItems
    .map((item) => {
      if (!item.children) {
        const active = isActive(item.href) ? " is-active" : "";
        return `<a href="${item.href}" class="${active.trim()}">${item.label}</a>`;
      }
      const activeClass = groupActive(item) ? " is-active" : "";
      return `
        <div class="nav-dropdown${activeClass}">
          <button type="button" class="nav-dropdown-trigger" aria-expanded="false">${item.label}</button>
          <div class="nav-dropdown-panel">
            ${item.children
              .map((child) => {
                const active = isActive(child.href) ? " is-active" : "";
                return `<a href="${child.href}" class="${active.trim()}">${child.label}</a>`;
              })
              .join("")}
          </div>
        </div>`;
    })
    .join("");

  const mobileNav = navItems
    .map((item) => {
      if (!item.children) {
        const active = isActive(item.href) ? " is-active" : "";
        return `<a href="${item.href}" class="${active.trim()}">${item.label}</a>`;
      }
      return `
        <div class="mobile-group">
          <strong>${item.label}</strong>
          ${item.children
            .map((child) => {
              const active = isActive(child.href) ? " is-active" : "";
              return `<a href="${child.href}" class="${active.trim()}">${child.label}</a>`;
            })
            .join("")}
        </div>`;
    })
    .join("");

  const header = `
    <header class="site-header" data-header>
      <div class="header-inner">
        <a class="brand" href="index.html" aria-label="IZIC 2026 home">
          <img class="brand-logo brand-logo-light" src="https://zda.org.zm/vs/izic/wp-content/uploads/2022/09/logo_site_.png" alt="IZIC" width="160" height="135" />
          <img class="brand-logo brand-logo-dark" src="https://zda.org.zm/izic/wp-content/uploads/2026/01/cropped-IZIC-Event-Logo-files-01.png" alt="IZIC" width="160" height="135" />
        </a>
        <nav class="nav-desktop" aria-label="Primary">${desktopNav}</nav>
        <div class="header-actions">
          <a class="btn btn-primary btn-sm header-cta" href="register.html">Register</a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" data-nav-toggle>
            <span class="sr-only">Menu</span><span></span><span></span>
          </button>
        </div>
      </div>
      <nav class="nav-mobile" id="mobile-nav" data-mobile-nav hidden>
        ${mobileNav}
        <a class="btn btn-primary" href="register.html">Register now</a>
      </nav>
    </header>`;

  const footer = `
    <footer class="site-footer site-footer-slim">
      <div class="wrap footer-slim">
        <div class="footer-slim-brand">
          <img src="https://zda.org.zm/vs/izic/wp-content/uploads/2022/09/zda_logo_white_website.png" alt="Zambia Development Agency" width="140" height="42" />
          <div class="footer-contact">
            <p><strong>IZIC Secretariat</strong></p>
            <p><a href="mailto:izic@zda.org.zm">izic@zda.org.zm</a></p>
            <p><a href="tel:+260211220177">+260 211 220177</a></p>
            <p>Kenneth Kaunda International Conference Centre · Lusaka</p>
          </div>
        </div>
        <div class="footer-powered">
          <a class="footer-sandbox" href="https://sandbox.africa/" target="_blank" rel="noopener noreferrer">
            <img src="assets/sandbox-africa-logo.png" alt="Sandbox Africa" width="160" height="48" />
          </a>
          <p class="copyright">
            © IZIC 2026 · Powered by SandboxAfrica
          </p>
        </div>
      </div>
    </footer>`;

  const notice = `
    <section class="notice notice-slim" aria-label="Important update" data-site-notice>
      <div class="wrap notice-inner">
        <p>
          <strong>Updated dates:</strong> 9–11 December 2026 at Kenneth Kaunda International Conference Centre · Existing registrations remain valid.
        </p>
        <a href="news.html#postponement">Details</a>
      </div>
    </section>`;

  const registerModal = `
    <div class="register-modal" hidden role="dialog" aria-modal="true" aria-labelledby="register-modal-title" data-register-modal>
      <div class="register-modal-backdrop" data-register-close tabindex="-1"></div>
      <div class="register-modal-panel" role="document">
        <button type="button" class="register-modal-close" data-register-close aria-label="Close registration">×</button>
        <div class="register-modal-layout">
          <aside class="register-modal-aside">
            <p class="eyebrow">IZIC 2026</p>
            <h2 id="register-modal-title">Join us in Lusaka</h2>
            <p class="register-modal-date">9–11 December 2026 · Kenneth Kaunda International Conference Centre</p>
            <ul class="register-modal-list">
              <li>Investors and financiers</li>
              <li>Project developers and exhibitors</li>
              <li>Policymakers and development partners</li>
              <li>Local enterprises seeking partnerships</li>
            </ul>
            <p class="register-modal-note">
              Confirmed July registrations remain valid for 9–11 December. No re-registration is required for already confirmed delegates.
            </p>
            <div class="register-modal-links">
              <a href="partnership.html">Become a partner</a>
              <a href="contact.html">Ask the secretariat</a>
            </div>
          </aside>
          <form class="register-form register-modal-form" data-register-form>
            <h3>Expression of interest</h3>
            <label>Full name<input type="text" name="name" required autocomplete="name" /></label>
            <label>Organisation<input type="text" name="org" required autocomplete="organization" /></label>
            <label>Email<input type="email" name="email" required autocomplete="email" /></label>
            <label>Country<input type="text" name="country" required autocomplete="country-name" /></label>
            <label>Participation type
              <select name="type" required>
                <option value="">Select…</option>
                <option>Delegate</option>
                <option>Exhibitor</option>
                <option>Sponsor / Partner</option>
                <option>Media</option>
              </select>
            </label>
            <label>Message<textarea name="message" rows="3" placeholder="Tell us briefly about your interest"></textarea></label>
            <label style="position:absolute;left:-9999px;" aria-hidden="true">Website<input type="text" name="website" tabindex="-1" autocomplete="off" /></label>
            <button class="btn btn-primary" type="submit" data-register-submit>Submit interest</button>
            <p class="form-note" data-register-note hidden></p>
            <p class="form-note form-note-error" data-register-error hidden></p>
          </form>
        </div>
      </div>
    </div>`;

  const headerMount = document.querySelector("[data-site-header]");
  const footerMount = document.querySelector("[data-site-footer]");
  const noticeMount = document.querySelector("[data-site-notice]");
  if (headerMount) headerMount.outerHTML = header;
  if (footerMount) footerMount.outerHTML = footer;
  if (noticeMount) noticeMount.outerHTML = notice;
  if (!document.querySelector("[data-register-modal]")) {
    document.body.insertAdjacentHTML("beforeend", registerModal);
  }
  if (page !== "home") {
    document.querySelector("[data-header]")?.classList.add("is-scrolled", "is-solid");
  }
})();
