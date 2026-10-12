(() => {
  const page = document.body.dataset.page || "home";
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  const navItems = [
    {
      label: "Conference",
      children: [
        { label: "About IZIC", href: "about.html" },
        { label: "Events Schedule", href: "schedule.html" },
        { label: "Partnership", href: "partnership.html" },
        { label: "Event Speakers", href: "speakers.html" },
        { label: "Presidential Awards", href: "awards.html" },
        { label: "2025 Highlights", href: "gallery.html" },
      ],
    },
    {
      label: "Invest",
      children: [
        { label: "Ready to Invest Projects", href: "projects.html" },
        { label: "Priority Sectors", href: "sectors.html" },
        { label: "Investment Incentives", href: "incentives.html" },
        { label: "Registering a Business", href: "business.html" },
        { label: "Success Stories", href: "stories.html" },
      ],
    },
    {
      label: "Media",
      children: [
        { label: "Publications", href: "publications.html" },
        { label: "Presentations", href: "presentations.html" },
        { label: "News & Press", href: "news.html" },
        { label: "Photo Gallery", href: "gallery.html" },
        { label: "Videos", href: "videos.html" },
      ],
    },
    {
      label: "Travel",
      children: [
        { label: "Hotels & Lodges", href: "travel.html" },
        { label: "Route / Map", href: "map.html" },
        { label: "Travel & Visas", href: "visas.html" },
        { label: "Tourism Packages", href: "tourism.html" },
        { label: "IZIC App", href: "app.html" },
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
          <a class="btn btn-primary btn-sm" href="register.html">Register</a>
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
          <nav aria-label="Footer">
            <a href="about.html">About</a>
            <a href="register.html">Register</a>
            <a href="contact.html">Contact</a>
            <a href="sitemap.html">Sitemap</a>
          </nav>
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

  const headerMount = document.querySelector("[data-site-header]");
  const footerMount = document.querySelector("[data-site-footer]");
  if (headerMount) headerMount.outerHTML = header;
  if (footerMount) footerMount.outerHTML = footer;
  if (page !== "home") {
    document.querySelector("[data-header]")?.classList.add("is-scrolled", "is-solid");
  }
})();
