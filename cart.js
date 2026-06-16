console.log("cart.js running");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartContainer = document.getElementById("cartItems");
const totalText = document.getElementById("total");

/* ================= RENDER ================= */

function renderCart() {

  cartContainer.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty</p>";
    totalText.innerText = "K0.00";
    return;
  }

  cart.forEach((item, index) => {

    total += item.price * item.qty;

    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <p>K${item.price.toFixed(2)}</p>
      </div>

      <div class="cart-controls">
        <button onclick="changeQty(${index}, -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${index}, 1)">+</button>
      </div>

      <div>
        <p>K${(item.price * item.qty).toFixed(2)}</p>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;

    cartContainer.appendChild(div);
  });

  totalText.innerText = "K" + total.toFixed(2);
}

/* ================= QUANTITY ================= */

function changeQty(index, change) {
  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
}

/* ================= REMOVE ================= */

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
}

/* ================= SAVE ================= */

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

/* ================= CHECKOUT ================= */

const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {
  checkoutBtn.onclick = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Check user is logged in
    if (!auth) { alert("Please log in to place an order."); return; }

    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to place an order.");
      window.location.href = "auth.html";
      return;
    }

    const name     = prompt("Your full name:");
    const address  = prompt("Your postal address:");
    const province = prompt("Your province (e.g. Morobe, NCD):");

    if (!name || !address || !province) {
      alert("Please fill in all delivery details.");
      return;
    }

    checkoutBtn.disabled = true;
    checkoutBtn.innerText = "Placing order...";

    try {
      const result = await placeOrder({
        customerName:   name,
        customerEmail:  user.email,
        address,
        province,
        deliveryMethod: "standard",
        items: cart,
      });

      alert(`Order placed! Your order ID is: ${result.orderId}\nA confirmation email has been sent.`);
      localStorage.removeItem("cart");
      cart = [];
      renderCart();

    } catch (err) {
      alert("Failed to place order: " + err.message);
    } finally {
      checkoutBtn.disabled = false;
      checkoutBtn.innerText = "Proceed to Checkout";
    }
  };
}

/* ================= INIT ================= */

renderCart();
