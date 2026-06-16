/* =====================================================
   LAYOUT.JS
   Injects the shared navbar and footer into every page.
   Each page only needs:
     <div id="navbar-placeholder"></div>
     <div id="footer-placeholder"></div>
   and to include this script BEFORE script.js
===================================================== */

function renderNavbar(activePage) {
  const placeholder = document.getElementById("navbar-placeholder");
  if (!placeholder) return;

  const links = [
    { href: "index.html", label: "Home" },
    { href: "AboutUs.html", label: "About" },
    { href: "OurShop.html", label: "Shop" },
    { href: "news.html", label: "News" },
    { href: "auth.html", label: "Account", id: "accountBtn" },
    { href: "cart.html", label: "🛒 Cart" }
  ];

  const itemsHTML = links.map(link => {
    const activeClass = link.href === activePage ? ' class="active"' : "";
    const id = link.id ? ` id="${link.id}"` : "";
    return `<li><a href="${link.href}"${activeClass}${id}>${link.label}</a></li>`;
  }).join("\n    ");

  placeholder.outerHTML = `
<nav class="navbar">
  <div class="logo">
    <img src="assets/image2.png" class="logo-img1" alt="FuzzyWuzzy Shop logo">
  </div>

  <h1 class="brand-title">FuzzyWuzzy Shop</h1>

  <div class="menu-toggle" id="menu-toggle">☰</div>

  <ul class="nav-menu" id="nav-menu">
    ${itemsHTML}
  </ul>
</nav>`;

  // Hamburger toggle
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => menu.classList.toggle("active"));
  }
}

function renderFooter() {
  const placeholder = document.getElementById("footer-placeholder");
  if (!placeholder) return;

  placeholder.outerHTML = `
<footer class="footer-section">
  <div class="footer-container">

    <div class="footer-col">
      <img src="assets/image2.png" class="footer-logo" alt="FuzzyWuzzy Shop logo">
      <h4>FuzzyWuzzy Shop</h4>
      <p>Premium digital illustration and apparel printing services. Built with creativity and quality.</p>
    </div>

    <div class="footer-col">
      <h4>Explore</h4>
      <a href="index.html">Home</a>
      <a href="AboutUs.html">About</a>
      <a href="OurShop.html">Shop</a>
      <a href="news.html">News</a>
    </div>

    <div class="footer-col">
      <h4>Business</h4>
      <a href="#">Pricing</a>
      <a href="#">Special Offers</a>
      <a href="#">Location</a>
    </div>

    <div class="footer-col">
      <h4>Contact</h4>
      <p>Email: support@fuzzywuzzyshop.com</p>
      <p>Phone: +675 XXX XXXX</p>
    </div>

  </div>

  <div class="footer-bottom">
    © 2025 FuzzyWuzzy Shop. All rights reserved.
  </div>
</footer>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page || "";
  renderNavbar(page);
  renderFooter();
});
