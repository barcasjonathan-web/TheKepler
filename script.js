const products = [
  { id: 1, name: "Camiseta Kepler", category: "Ropa", price: 24.90, image: "img/camiseta01.jpg" },
  { id: 2, name: "Zapatillas Urban", category: "Calzado", price: 49.90, image: "img/zapatos01.jpg" },
  { id: 3, name: "Sudadera Classic", category: "Ropa", price: 39.90, image: "img/sudadera01.jpg" },
  { id: 4, name: "Lámpara Minimal", category: "Hogar", price: 34.90, image: "img/lampara01.jpg" },
  { id: 5, name: "Cojín Home", category: "Hogar", price: 18.90, image: "img/cojin01.jpg" },
  { id: 6, name: "Bolso Essential", category: "Accesorios", price: 29.90, image: "img/bolso01.jpg" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let likes = JSON.parse(localStorage.getItem("likes")) || {};

const grid = document.getElementById("productGrid");
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
const currentCategory = document.body.dataset.category || "Todos";

function money(value) {
  return value.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

function renderProducts(category = "Todos") {
  const list = category === "Todos" ? products : products.filter(p => p.category === category);
  grid.innerHTML = list.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="image-wrapper">
        <img src="${p.image}" alt="${p.name}">
        <span class="category">${p.category}</span>
      </div>
      <div class="product-info">
      <h3 class="product-name">${p.name}</h3>
      <div class="product-meta">
      <div class="price">${money(p.price)}</div>
      <button class="like-btn" data-id="${p.id}">
        <img src="img/${likes[p.id] ? 'like.png' : 'unlike.png'}" 
          alt="Me gusta" class="heart-icon">
      </button>
   </div>
  <button class="add-full" data-id="${p.id}">Añadir al carrito</button>
</div>
</article>
`).join('');
}

function toggleLike(id) {
  const numId = parseInt(id, 10);
  likes[id] = !likes[id]; // alterna true/false
  localStorage.setItem("likes", JSON.stringify(likes));
  renderProducts(currentCategory); // refresca la vista
}

// Delegación de eventos para el corazón
grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".like-btn");
  if (!btn) return;
  const id = (btn.dataset.id);
  toggleLike(id);
});


grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-full");
  if (!btn) return;
  const id = btn.dataset.id;
  addToCart(id);
  renderCart(); // refresca el panel con los productos
});
const categoryFilter = document.getElementById("categoryFilter");
if (categoryFilter) {
  categoryFilter.addEventListener("change", (e) => {
    const selected = e.target.value;
    renderProducts(selected);   // muestra solo la categoría elegida
    renderCart();               // refresca el carrito si hace falta
  });
}
function addToCart(id) {
  const product = products.find(p => p.id === Number(id));
  if (!product) return;

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, qty: 1, price: product.price, name: product.name });
  }

  const totalQty = cart.reduce((s, it) => s + it.qty, 0);
  const totalPrice = cart.reduce((s, it) => s + it.qty * it.price, 0);

  cartCount.textContent = totalQty;
  cartTotal.textContent = money(totalPrice);
  localStorage.setItem("cart", JSON.stringify(cart));
  
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
  localStorage.setItem("cart", JSON.stringify(cart));
  
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
  
renderProducts(currentCategory);
renderCart();
  // --- Conexión con Supabase ---
const SUPABASE_URL = "https://nsoiiuzuqstjmicotruf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_8p928Sjxq2K7yhFscTx41w_ocI76h4i";

const { createClient } = supabase;

const supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// --- Registro con Supabase ---
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("regName").value;
    const surname = document.getElementById("regSurname").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    const { error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
          surname: surname
        }
      }
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Registro realizado correctamente. Revisa tu correo para confirmar tu cuenta.");
    registerForm.reset();
  });
}
// --- Login con Supabase ---
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Inicio de sesión correcto");

    // Cerrar el panel de Login
    const loginModal = document.getElementById("loginModal");

    if (loginModal) {
      loginModal.style.display = "none";
    }

    console.log("Usuario conectado:", data.user);
  });
}

// --- Botones X para cerrar paneles ---
const closeButtons = document.querySelectorAll(".close");
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const loginModal = document.getElementById("loginModal");
    const profilePanel = document.getElementById("profilePanel");
    // Cerrar Login
    if (loginModal) {
      loginModal.style.display = "none";
      loginModal.hidden = true;
    }
    // Cerrar Perfil
    if (profilePanel) {
      profilePanel.style.display = "none";
      profilePanel.hidden = true;
    }
  });
});
// --- Botón Entrar / Perfil ---
const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const profilePanel = document.getElementById("profilePanel");
// Actualizar texto del botón según la sesión
async function actualizarBotonUsuario() {
  if (!loginBtn) return;
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    loginBtn.textContent = "Mi Perfil";
  } else {
    loginBtn.textContent = "Entrar / Registrarse";
  }
}
// Comprobar sesión al cargar la página
actualizarBotonUsuario();
// Qué hacer al pulsar Entrar / Mi Perfil
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
      // Usuario conectado → abrir Perfil
      if (profilePanel) {
        profilePanel.hidden = false;
        profilePanel.style.display = "block";
      }
    } else {
      // Usuario no conectado → abrir Login
      if (loginModal) {
        loginModal.hidden = false;
        loginModal.style.display = "block";
      }
    }
  });
}
// Detectar Login / Logout automáticamente
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (!loginBtn) return;
  if (session) {
    loginBtn.textContent = "Mi Perfil";
  } else {
    loginBtn.textContent = "Entrar / Registrarse";
  }
});
// --- CERRAR SESIÓN ---

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async function () {

    console.log("Botón Cerrar sesión pulsado");

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error("Error al cerrar sesión:", error);
      alert("No se pudo cerrar sesión: " + error.message);
      return;
    }

    console.log("Sesión cerrada correctamente");

    // Cerrar panel de perfil
    const profilePanel = document.getElementById("profilePanel");

    if (profilePanel) {
      profilePanel.hidden = true;
      profilePanel.style.display = "none";
    }

    // Cambiar botón principal
    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {
      loginBtn.textContent = "Entrar / Registrarse";
    }

  });
}
