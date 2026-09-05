const products = [
  { id: 1, name: "Camiseta Kepler", category: "Ropa", price: 24.90, image: "img/camiseta01.jpg" },
  { id: 2, name: "Zapatillas Urban", category: "Calzado", price: 49.90, image: "img/zapatos01.jpg" },
  { id: 3, name: "Sudadera Classic", category: "Ropa", price: 39.90, image: "img/sudadera01.jpg" },
  { id: 4, name: "Lámpara Minimal", category: "Hogar", price: 34.90, image: "img/lampara01.jpg" },
  { id: 5, name: "Cojín Home", category: "Hogar", price: 18.90, image: "img/cojin01.jpg" },
  { id: 6, name: "Bolso Essential", category: "Accesorios", price: 29.90, image: "img/bolso01.jpg" }
];

let cart = [];

const grid = document.getElementById("productGrid");
const filter = document.getElementById("categoryFilter");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

const whatsappBtn = document.getElementById("whatsappBtn");
const reservationForm = document.getElementById("reservationForm");
const customerName = document.getElementById("customerName");
const confirmReservation = document.getElementById("confirmReservation");
const cancelReservation = document.getElementById("cancelReservation");

function money(value) {
  return value.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

function renderProducts(category = "Todos") {
  const list = category === "Todos" ? products : products.filter(p => p.category === category);
  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <div class="product-info">
        <div class="product-meta">
          <div>
            <h3>${p.name}</h3>
            <span class="category">${p.category}</span>
          </div>
          <span class="price">${money(p.price)}</span>
        </div>
        <button class="add-btn" onclick="addToCart(${p.id})">Añadir al carrito</button>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const found = cart.find(item => item.id === id);
  if (found) found.qty += 1;
  else cart.push({ ...products.find(p => p.id === id), qty: 1 });
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartCount.textContent = count;
  cartTotal.textContent = money(total);

  if (!cart.length) {
    cartItems.innerHTML = "<p>Tu carrito está vacío.</p>";
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong><br>
        <small>${item.qty} × ${money(item.price)} = ${money(item.price * item.qty)}</small>
        
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">Quitar</button>
    </div>
  `).join("");
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("show");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
  cartPanel.setAttribute("aria-hidden", "true");
}

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
filter.addEventListener("change", e => renderProducts(e.target.value));

whatsappBtn.addEventListener("click", () => {
  if (!cart.length) {
    alert("Añade al menos un producto al carrito.");
    return;
  }
  reservationForm.hidden = false;

  const preview = cart.map(item =>
    `<p>${item.name} x${item.qty} = ${money(item.price * item.qty)}</p>`
  ).join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  
  document.getElementById("orderPreview").innerHTML = `
    <strong>Tu pedido:</strong>
    ${preview}
    <p><strong>Total: ${money(total)}</strong></p>
  `;
  customerName.focus();
});

confirmReservation.addEventListener("click", () => {
  const name = customerName.value.trim();

  if (!name) {
    alert("Escribe tu nombre completo.");
    customerName.focus();
    return;
  }
  const phone = "53691544"; // tu número

  const lines = cart.map(item =>
  `- ${item.name} x${item.qty} = ${money(item.price * item.qty)}`
);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const message =
    `Hola Kepler, mi nombre es ${name}.\n\nQuiero hacer este pedido:\n\n${lines.join("\n")}\n\nTotal: ${money(total)}`;
  
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  reservationForm.hidden = true;
  customerName.value = "";
});

cancelReservation.addEventListener("click", () => {
  reservationForm.hidden = true;
  customerName.value = "";
});
  
renderProducts();
renderCart();
