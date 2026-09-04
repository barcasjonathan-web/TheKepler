const products = [
  { id: 1, name: "Camiseta Kepler", category: "Ropa", price: 24.90, image: "images/camiseta01.jpg" },
  { id: 2, name: "Zapatillas Urban", category: "Calzado", price: 49.90, image: "images/zapatos01.jpg" },
  { id: 3, name: "Sudadera Classic", category: "Ropa", price: 39.90, image: "images/sudadera01.jpg" },
  { id: 4, name: "Lámpara Minimal", category: "Hogar", price: 34.90, image: "images/lampara01.jpg" },
  { id: 5, name: "Cojín Home", category: "Hogar", price: 18.90, image: "images/cojin01.jpg" },
  { id: 6, name: "Bolso Essential", category: "Accesorios", price: 29.90, image: "images/bolso01.jpg" }
];

let cart = JSON.parse(localStorage.getItem("keplerCart")) || [];

const grid = document.getElementById("productGrid");
const filter = document.getElementById("categoryFilter");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

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
  localStorage.setItem("keplerCart", JSON.stringify(cart));
  
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
        <small>${item.qty} × ${money(item.price)}</small>
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

document.getElementById("whatsappBtn").addEventListener("click", () => {
  if (!cart.length) {
    alert("Añade al menos un producto al carrito.");
    return;
  }

  // IMPORTANTE: sustituye este número por tu WhatsApp con código de país, sin + ni espacios.
  // Ejemplo España: 34600111222
  const phone = "53691544";

  const lines = cart.map(item =>
    `- ${item.name} x${item.qty} = ${money(item.price * item.qty)}`
  );
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const message =
    `Hola Kepler, quiero hacer este pedido:\n\n${lines.join("\n")}\n\nTotal: ${money(total)}`;

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
});

renderProducts();
renderCart();
