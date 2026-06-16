console.log("script.js is running");

/* =====================================================
   GLOBAL STATE
===================================================== */

let selectedProduct = {};
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* =====================================================
   MAIN
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ================= HERO SLIDER ================= */

  const slides = document.querySelectorAll('.hero-bg-slider span');

  if (slides.length > 0) {
    let currentSlide = 0;
    slides[currentSlide].classList.add('active');

    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000);
  }

  /* ================= ELEMENTS ================= */

  const dtfModal = document.getElementById("dtfModal");
  const previewModal = document.getElementById("previewModal");

  const productInput = document.getElementById("productName");
  const priceInput = document.getElementById("productPrice");

  const deliverySelect = document.getElementById("deliveryFee");
  const totalText = document.getElementById("totalAmount");

  let currentPrice = 0;

  /* ================= TOTAL ================= */

  function updateTotal() {
    if (!totalText || !deliverySelect) return;

    const delivery = parseFloat(deliverySelect.value) || 0;
    const total = currentPrice + delivery;

    totalText.innerText = "K" + total.toFixed(2);
  }

  /* ================= PREVIEW MODAL (Quick View) ================= */

  document.querySelectorAll(".preview-btn").forEach(btn => {
    btn.addEventListener("click", () => {

      selectedProduct = {
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        front: btn.dataset.front,
        back: btn.dataset.back,
        desc: btn.dataset.desc
      };

      if (previewModal) {
        document.getElementById("previewTitle").innerText = selectedProduct.name;
        document.getElementById("frontImage").src = selectedProduct.front;
        document.getElementById("backImage").src = selectedProduct.back;
        document.getElementById("previewDesc").innerText = selectedProduct.desc;
        document.getElementById("previewPrice").innerText = "K" + selectedProduct.price;

        previewModal.style.display = "flex";
      }
    });
  });

  // Close preview modal
  document.querySelectorAll(".close-preview").forEach(btn => {
    btn.addEventListener("click", () => {
      if (previewModal) previewModal.style.display = "none";
    });
  });

  /* ================= CONFIRM ORDER (from preview -> DTF order form) ================= */

  const confirmBtn = document.getElementById("confirmOrderBtn");

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {

      if (previewModal) previewModal.style.display = "none";

      if (productInput && priceInput && dtfModal) {
        productInput.value = selectedProduct.name;
        priceInput.value = selectedProduct.price;

        currentPrice = selectedProduct.price;

        dtfModal.style.display = "flex";
        updateTotal();
      } else {
        // Pages without a DTF order form (e.g. homepage) -> add to cart instead
        addToCart(selectedProduct.name, selectedProduct.price);
      }
    });
  }

  // Close DTF order modal
  document.querySelectorAll(".close-dtf").forEach(btn => {
    btn.addEventListener("click", () => {
      if (dtfModal) dtfModal.style.display = "none";
    });
  });

  /* ================= DELIVERY ================= */

  if (deliverySelect) {
    deliverySelect.addEventListener("change", updateTotal);
  }

  /* ================= OPEN MODAL (Order DTF buttons) ================= */

  document.querySelectorAll(".openModalBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (dtfModal) dtfModal.style.display = "flex";
    });
  });

  /* ================= ADD TO CART ================= */

  function addToCart(name, price) {
    const item = cart.find(p => p.name === name);

    if (item) {
      item.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {

      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);

      addToCart(name, price);

      // Button feedback
      const originalText = btn.innerText;
      btn.innerText = "Added ✓";
      setTimeout(() => {
        btn.innerText = originalText;
      }, 1500);
    });
  });

  /* ================= CONTACT FORM ================= */

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector(".submit-btn");
      if (submitBtn) submitBtn.disabled = true;

      try {
        await sendContactForm({
          name:    document.getElementById("name").value,
          email:   document.getElementById("email").value,
          message: document.getElementById("message").value,
        });

        if (formStatus) {
          formStatus.innerText = "Message sent! We will get back to you soon.";
          formStatus.className = "form-status success";
        }
        contactForm.reset();

      } catch (err) {
        if (formStatus) {
          formStatus.innerText = "Failed to send. Please try again.";
          formStatus.className = "form-status error";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

});
