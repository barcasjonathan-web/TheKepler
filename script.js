const products = [
  { id: 1, name: "Camiseta Kepler", category: "Ropa", price: 24.90, image: "img/camiseta01.jpg",
  description: "Camiseta Kepler de diseño moderno y cómodo para el día a día.",
  variants: [
  { color: "Blanco", size: "m", stock: 3 },
  { color: "purpura", size: "xl", stock: 2 },
  { color: "Gris", size: "l", stock: 1 },
  { color: "Blanco", size: "xl", stock: 3 }
]},
  
  { id: 2, name: "Zapatillas Urban", category: "Calzado", price: 49.90, image: "img/zapatos01.jpg",
  description: "Zapatillas Urban de estilo moderno, cómodas y perfectas para el uso diario.",
  variants: [
  { color: "Blanco", size: "42", stock: 4 },
  { color: "Negro", size: "39", stock: 1 },
  { color: "Gris", size: "41", stock: 3 }
]},

  { id: 3, name: "Sudadera Classic", category: "Ropa", price: 39.90, image: "img/sudadera01.jpg",
  description: "Sudadera Classic cómoda y versátil, perfecta para combinar con cualquier estilo.",
  variants: [
  { color: "roja", size: "xl", stock: 3 },
  { color: "azul", size: "xxx", stock: 1 },
  { color: "rosada", size: "l", stock: 2 }
]},
  
  { id: 4, name: "Lámpara Minimal", category: "Hogar", price: 34.90, image: "img/lampara01.jpg",
  description: "Lámpara de diseño minimalista para darle un toque moderno a tu hogar.",
  variants: [
  { color: "Blanco", stock: 4 }
]},
  
  { id: 5, name: "Cojín Home", category: "Hogar", price: 18.90, image: "img/cojin01.jpg",
  description: "Cojín decorativo cómodo y elegante para cualquier espacio del hogar.",
  variants: [
  { color: "Blanco", stock: 2 },
  { color: "Negro", stock: 1 }
]},
  
  { id: 6, name: "Bolso Essential", category: "Accesorios", price: 29.90, image: "img/bolso01.jpg",
  description: "Bolso Essential práctico y versátil para acompañarte todos los días.",
  variants: [
  { color: "Blanco", stock: 2 },
  { color: "Negro", stock: 2 },
  { color: "Gris", stock: 1 }
]},

  { id: 7, name: "Zapatillas Kepler", category: "Calzado", price: 50.90, image: "products/zapataillakepler.png",
  description: "Zapatillas Kepler de estilo moderno, unico, cómodas, lo ultimo en calzado",
  gallery: [
  "products/zapataillakepler01.png",
  "products/zapataillakepler02.png",
  "products/zapataillakepler03.png",
  "products/zapataillakepler04.png",
  "products/zapataillakepler05.png"],
  variants: [
  { color: "Blanco", size: "40", stock: 2 },
  { color: "Negro", size: "39", stock: 2 },
  { color: "Gris", size: "44", stock: 1 }]
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let likes = JSON.parse(localStorage.getItem("likes")) || {};
let currentProduct = null;
const productModalBody = document.getElementById("productModalBody");

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
  <button class="add-full" data-id="${p.id}">Ver Producto →</button>
</div>
</article>
`).join('');
}
// --- Abrir producto individual ---
grid.addEventListener("click", (e) => {
  // Si se pulsa el botón de like, no abrir el producto
  if (e.target.closest(".like-btn")) {
    return;
  }
  // Si se pulsa el botón del producto, abrir el producto
const addButton = e.target.closest(".add-full");
if (addButton) {
  const productId = Number(addButton.dataset.id);
  abrirProducto(productId);
  return;
}
  const card = e.target.closest(".product-card");
  if (!card) return;
  const productId = Number(card.dataset.id);
  abrirProducto(productId);
});


async function abrirProducto(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  currentProduct = product;
  const productModal = document.getElementById("productModal");
  if (!productModal || !productModalBody) return;
  const gallery = product.gallery || [];
  productModalBody.innerHTML = `
  <div class="product-detail">
  <div class="product-detail-gallery">
  <div class="product-detail-image">
  <img 
  id="productMainImage"
  src="${product.image}" 
  alt="${product.name}"
  >
  </div>
  ${
    gallery.length > 0 
    ? `
    <div class="product-thumbnails">
    ${gallery.map((image, index) => `
    <button class="product-thumbnail"data-image="${image}"aria-label="Ver imagen ${index + 1}">
    <img src="${image}" alt="${product.name}">
    </button>
    `).join("")}
    </div>`: ""}
  </div>
  <div class="product-detail-info">
  <span class="category">
  ${product.category}</span>
  <h2>${product.name}</h2>
  <div class="product-detail-price">
  ${money(product.price)}
  </div>
  <div class="product-detail-rating" id="productRating">
  <span class="rating-stars">
    ☆☆☆☆☆
  </span>
  <span class="rating-text">
    Sé el primero en valorar
  </span>
</div>

<div id="reviewBox" class="review-box" hidden>

  <button id="closeReviewBox">✕</button>

  <div class="review-stars">
  <span data-star="1">☆</span>
  <span data-star="2">☆</span>
  <span data-star="3">☆</span>
  <span data-star="4">☆</span>
  <span data-star="5">☆</span>
</div>

  <textarea 
    id="reviewText"
    maxlength="300"
    placeholder="Escribe tu opinión..."
  ></textarea>

  <button id="sendReview">
    Publicar reseña
  </button>

</div>

  <h3>Descripción</h3>
  <p>${product.description}</p>
  <div class="product-reviews-section">
  <h3>Comentarios</h3>

  <div id="reviewsList">
    Cargando comentarios...
  </div>
</div>
  
${product.variants && product.variants.length > 0 ? `
  ${[...new Set(
    product.variants
      .filter(v => v.color)
      .map(v => v.color)
  )].length > 0 ? `
    <div class="product-option">
      <h3>Color</h3>
      <div class="color-options">
        ${[...new Set(
          product.variants
            .filter(v => v.color)
            .map(v => v.color)
        )]
        .map(color => `
          <button
            type="button"
            class="color-option"
            data-color="${color}">
            ${color}
          </button>
        `).join("")}
      </div>
    </div>
  ` : ""}
  ${[...new Set(
    product.variants
      .filter(v => v.size)
      .map(v => v.size)
  )].length > 0 ? `
    <div class="product-option">
      <h3>Talla</h3>
      <div class="size-options">
        ${[...new Set(
          product.variants
            .filter(v => v.size)
            .map(v => v.size)       )]
        .map(size => `
          <button
            type="button"
            class="size-option"
            data-size="${size}">
            ${size}
          </button>        `).join("")}
      </div>    </div>
  ` : ""}
` : ""}
<div class="product-option quantity-option">
<h3>Cantidad</h3>
<div class="quantity-control">
<p class="quantity-limit-message"></p>
<button type="button" class="quantity-btn quantity-minus">−</button>
<span class="quantity-value">1</span>
<button type="button" class="quantity-btn quantity-plus">+</button>
</div>
</div>
<button type="button" class="add-product-to-cart">
  Añadir al carrito
</button>
</div>
</div>
`;
  productModal.hidden = false;
  cargarResenas(product.id);
  const primeraVariante = product.variants?.find(v => v.stock > 0);
  const yaTieneResena = await comprobarResenaUsuario(product.id);
  const reviewBox = document.getElementById("reviewBox");
  const reviewStars = reviewBox?.querySelector(".review-stars");

if (reviewBox && reviewStars) {
  reviewStars.innerHTML = `
    <span data-star="1">☆</span>
    <span data-star="2">☆</span>
    <span data-star="3">☆</span>
    <span data-star="4">☆</span>
    <span data-star="5">☆</span>
  `;
  reviewBox.dataset.rating = "";
}

if (primeraVariante) {
  if (primeraVariante.color) {
    const colorButton = productModalBody.querySelector(
      `.color-option[data-color="${primeraVariante.color}"]`
    );
    colorButton?.classList.add("selected");
  }

  if (primeraVariante.size) {
    const sizeButton = productModalBody.querySelector(
      `.size-option[data-size="${primeraVariante.size}"]`
    );
    sizeButton?.classList.add("selected");
  }
}
  actualizarLimiteCantidad();
  actualizarOpcionesDisponibles();
  actualizarBotonAnadirCarrito();
}

async function comprobarResenaUsuario(productId) {

  const { data: { user } } = await supabaseClient.auth.getUser();

  // Si no hay usuario conectado
  if (!user) {
    return false;
  }

  const { data, error } = await supabaseClient
    .from("reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error comprobando reseña:", error);
    return false;
  }

  // Si encontró una reseña devuelve true
  return !!data;
}

async function cargarResenas(productId) {
  const reviewsList = document.getElementById("reviewsList");

  if (!reviewsList) return;

  const { data, error } = await supabaseClient
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando reseñas:", error);
    reviewsList.textContent = "No se pudieron cargar las reseñas.";
    return;
  }

  if (!data || data.length === 0) {
    reviewsList.textContent = "Todavía no hay reseñas.";
    return;
  }

  reviewsList.innerHTML = data.map(review => `
    <div class="review-item">
      <div class="review-header">

        <div class="review-user">

          ${
            review.avatar_url
              ? `<img src="${review.avatar_url}" alt="Foto de perfil">`
              : `<div class="review-avatar-letter">
                  ${(review.user_name || "U").charAt(0).toUpperCase()}
                </div>`
          }

          <span>${review.user_name}</span>

        </div>

        <div class="review-stars">
          ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
        </div>

      </div>

      <p class="review-comment">
        ${review.comment}
      </p>
    </div>
  `).join("");
}

// --- Publicar reseña ---
document.addEventListener("click", async (e) => {

  if (e.target.id !== "sendReview") return;

  // Comprobar usuario conectado
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    alert("Debes iniciar sesión para publicar una reseña.");
    return;
  }

  // Comprobar que tenemos un producto abierto
  if (!currentProduct) {
    alert("No se ha podido identificar el producto.");
    return;
  }

  const reviewBox = document.getElementById("reviewBox");
  const reviewText = document.getElementById("reviewText");

  if (!reviewBox || !reviewText) return;

  // Obtener valoración seleccionada
  const rating = Number(reviewBox.dataset.rating);

  if (!rating || rating < 1 || rating > 5) {
    alert("Selecciona una valoración de 1 a 5 estrellas.");
    return;
  }

  // Obtener comentario
  const comment = reviewText.value.trim();

  if (!comment) {
    alert("Escribe tu opinión antes de publicar.");
    reviewText.focus();
    return;
  }

  // Comprobar si este usuario ya publicó una reseña
  const yaTieneResena = await comprobarResenaUsuario(currentProduct.id);

  if (yaTieneResena) {
    alert("Ya has publicado una reseña para este producto.");
    return;
  }

  // Datos del usuario
  const nombre = user.user_metadata.name || "";
  const apellido = user.user_metadata.surname || "";
  const userName = `${nombre} ${apellido}`.trim() || "Usuario";
  const avatarUrl = user.user_metadata.avatar_url || null;

  // Guardar reseña en Supabase
  const { error } = await supabaseClient
    .from("reviews")
    .insert({
      product_id: currentProduct.id,
      user_id: user.id,
      user_name: userName,
      avatar_url: avatarUrl,
      rating: rating,
      comment: comment
    });

  if (error) {
    console.error("Error publicando reseña:", error);
    alert("No se pudo publicar la reseña: " + error.message);
    return;
  }

  // Limpiar formulario
  reviewText.value = "";
  reviewBox.dataset.rating = "";

  const stars = reviewBox.querySelectorAll(".review-stars span");

  stars.forEach(star => {
    star.textContent = "☆";
  });

  // Recargar comentarios
  await cargarResenas(currentProduct.id);

  alert("¡Reseña publicada correctamente!");

});

function actualizarLimiteCantidad() {
  if (!currentProduct || !productModalBody) return;
  const quantityValue =
    productModalBody.querySelector(".quantity-value");
  const limitMessage =
    productModalBody.querySelector(".quantity-limit-message");
  const plusButton =
  productModalBody.querySelector(".quantity-plus");
  if (!quantityValue) return;
  const color =
    productModalBody.querySelector(".color-option.selected")?.dataset.color || null;
  const size =
    productModalBody.querySelector(".size-option.selected")?.dataset.size || null;
  const varianteSeleccionada = currentProduct.variants.find(variant =>
  (variant.color || null) === color &&
  (variant.size || null) === size
);

let stockDisponible = varianteSeleccionada
  ? varianteSeleccionada.stock
  : null;
  
  const yaEnCarrito = cart
    .filter(item =>
      item.id === currentProduct.id &&
      (item.color || null) === color &&
      (item.size || null) === size
    )
    .reduce((sum, item) => sum + item.qty, 0);
  const disponible =
  stockDisponible === null
    ? 0
    : Math.max(0, stockDisponible - yaEnCarrito);
  let quantity =
    parseInt(quantityValue.textContent, 10) || 1;
  if (disponible > 0) {
    quantity = Math.min(quantity, disponible);
  } else {
    quantity = 1;  }
  quantityValue.textContent = quantity;

if (plusButton) {
  plusButton.style.display =
    disponible > 0 && quantity < disponible ? "" : "none";
}

if (limitMessage) {
    if (stockDisponible !== null && disponible <= 0) {
      limitMessage.textContent =
        "⚠ No quedan unidades disponibles para esta combinación.";
    } else if (quantity >= disponible) {
      limitMessage.textContent =
        "⚠ Has llegado al límite de unidades disponibles.";
    } else {
      limitMessage.textContent = "";    }  }}

function actualizarBotonAnadirCarrito() {
  if (!currentProduct || !productModalBody) return;

  const addButton =
    productModalBody.querySelector(".add-product-to-cart");

  if (!addButton) return;

  const stockTotal = (currentProduct.variants || [])
    .reduce((total, variant) => total + (variant.stock || 0), 0);

  const enCarrito = cart
    .filter(item => item.id === currentProduct.id)
    .reduce((total, item) => total + item.qty, 0);
  const color =
  productModalBody.querySelector(".color-option.selected")?.dataset.color || null;

const size =
  productModalBody.querySelector(".size-option.selected")?.dataset.size || null;

const varianteSeleccionada = (currentProduct.variants || []).find(variant =>
  (variant.color || null) === color &&
  (variant.size || null) === size
);

const usadoDeVariante = cart
  .filter(item =>
    item.id === currentProduct.id &&
    (item.color || null) === color &&
    (item.size || null) === size
  )
  .reduce((total, item) => total + item.qty, 0);

const stockVariante = varianteSeleccionada
  ? varianteSeleccionada.stock
  : null;

const disponibleVariante =
  stockVariante === null
    ? null
    : Math.max(0, stockVariante - usadoDeVariante);

  if (
  enCarrito >= stockTotal ||
  (disponibleVariante !== null && disponibleVariante <= 0)
) {
  addButton.style.display = "none";
} else {
  addButton.style.display = "";
  }
}

// Cambiar imagen principal desde la galería
if (productModalBody) {
  productModalBody.addEventListener("click", (e) => {
    const thumbnail =
      e.target.closest(".product-thumbnail");
    if (!thumbnail) return;
    const mainImage =
      document.getElementById("productMainImage");
    if (!mainImage) return;
    mainImage.src =
      thumbnail.dataset.image;
  });
}

function actualizarOpcionesDisponibles() {
  if (!currentProduct?.variants || !productModalBody) return;

  const variants = currentProduct.variants.filter(
    variant => variant.stock > 0
  );

  let selectedColor =
    productModalBody.querySelector(".color-option.selected")?.dataset.color || null;

  let selectedSize =
    productModalBody.querySelector(".size-option.selected")?.dataset.size || null;


  // =====================================================
  // SI HAY COLOR SELECCIONADO
  // =====================================================

  if (selectedColor) {

    const tallasDisponibles = [
      ...new Set(
        variants
          .filter(v => v.color === selectedColor && v.size)
          .map(v => v.size)
      )
    ];

    // Si la talla actual ya no es válida,
    // escogemos una talla disponible.
    if (!tallasDisponibles.includes(selectedSize)) {

      const nuevaTalla = tallasDisponibles[0] || null;

      productModalBody
        .querySelectorAll(".size-option")
        .forEach(btn => btn.classList.remove("selected"));

      if (nuevaTalla) {

        const tallaButton = productModalBody.querySelector(
          `.size-option[data-size="${CSS.escape(nuevaTalla)}"]`
        );

        if (tallaButton) {
          tallaButton.classList.add("selected");
          selectedSize = nuevaTalla;
        }
      } else {
        selectedSize = null;
      }
    }
  }


  // =====================================================
  // SI HAY TALLA SELECCIONADA
  // =====================================================

  if (selectedSize) {

    const coloresDisponibles = [
      ...new Set(
        variants
          .filter(v => v.size === selectedSize && v.color)
          .map(v => v.color)
      )
    ];

    // Si el color actual ya no es válido,
    // escogemos un color disponible.
    if (!coloresDisponibles.includes(selectedColor)) {

      const nuevoColor = coloresDisponibles[0] || null;

      productModalBody
        .querySelectorAll(".color-option")
        .forEach(btn => btn.classList.remove("selected"));

      if (nuevoColor) {

        const colorButton = productModalBody.querySelector(
          `.color-option[data-color="${CSS.escape(nuevoColor)}"]`
        );

        if (colorButton) {
          colorButton.classList.add("selected");
          selectedColor = nuevoColor;
        }
      } else {
        selectedColor = null;
      }
    }
  }


  // =====================================================
  // MARCAR COLORES DISPONIBLES / GRISES
  // =====================================================

  productModalBody.querySelectorAll(".color-option").forEach(button => {

    const color = button.dataset.color;

    const disponible = variants.some(variant => {

      if (variant.color !== color) return false;

      if (selectedSize) {
        return variant.size === selectedSize;
      }

      return true;
    });

    button.classList.toggle("incompatible", !disponible);

    // MUY IMPORTANTE:
    // nunca bloquear el botón.
    button.disabled = false;
    button.removeAttribute("disabled");
  });


  // =====================================================
  // MARCAR TALLAS DISPONIBLES / GRISES
  // =====================================================

  productModalBody.querySelectorAll(".size-option").forEach(button => {

    const size = button.dataset.size;

    const disponible = variants.some(variant => {

      if (variant.size !== size) return false;

      if (selectedColor) {
        return variant.color === selectedColor;
      }

      return true;
    });

    button.classList.toggle("incompatible", !disponible);

    // MUY IMPORTANTE:
    // nunca bloquear el botón.
    button.disabled = false;
    button.removeAttribute("disabled");
  });
        }

// Seleccionar color y talla
if (productModalBody) {
  productModalBody.addEventListener("click", (e) => {

    // =====================================================
    // COLOR
    // =====================================================

    const colorButton = e.target.closest(".color-option");

    if (colorButton) {

      const color = colorButton.dataset.color;

      const variants =
        currentProduct?.variants?.filter(
          variant => variant.stock > 0
        ) || [];


      // Seleccionar color
      productModalBody
        .querySelectorAll(".color-option")
        .forEach(btn => {
          btn.classList.remove("selected");
          btn.disabled = false;
          btn.removeAttribute("disabled");
        });

      colorButton.classList.add("selected");


      // Buscar tallas disponibles para este color
      const tallasDisponibles = [
        ...new Set(
          variants
            .filter(v => v.color === color && v.size)
            .map(v => v.size)
        )
      ];


      const tallaActual =
        productModalBody
          .querySelector(".size-option.selected")
          ?.dataset.size || null;


      // Si la talla actual sigue siendo válida,
      // la conservamos.
      if (
        tallaActual &&
        tallasDisponibles.includes(tallaActual)
      ) {

        // La talla actual sigue siendo válida.

      } else {

        // La talla actual ya no sirve.
        // Elegimos automáticamente la primera disponible.

        productModalBody
          .querySelectorAll(".size-option")
          .forEach(btn => {
            btn.classList.remove("selected");
            btn.disabled = false;
            btn.removeAttribute("disabled");
          });


        if (tallasDisponibles.length > 0) {

          const nuevaTalla = tallasDisponibles[0];

          const tallaButton =
            productModalBody.querySelector(
              `.size-option[data-size="${CSS.escape(nuevaTalla)}"]`
            );

          if (tallaButton) {
            tallaButton.classList.add("selected");
          }
        }
      }


      actualizarOpcionesDisponibles();
      actualizarLimiteCantidad();
      actualizarBotonAnadirCarrito();

      return;
    }


    // =====================================================
    // TALLA
    // =====================================================

    const sizeButton = e.target.closest(".size-option");

    if (sizeButton) {

      const size = sizeButton.dataset.size;

      const variants =
        currentProduct?.variants?.filter(
          variant => variant.stock > 0
        ) || [];


      // Seleccionar talla
      productModalBody
        .querySelectorAll(".size-option")
        .forEach(btn => {
          btn.classList.remove("selected");
          btn.disabled = false;
          btn.removeAttribute("disabled");
        });

      sizeButton.classList.add("selected");


      // Buscar colores disponibles para esta talla
      const coloresDisponibles = [
        ...new Set(
          variants
            .filter(v => v.size === size && v.color)
            .map(v => v.color)
        )
      ];


      const colorActual =
        productModalBody
          .querySelector(".color-option.selected")
          ?.dataset.color || null;


      // Si el color actual sigue siendo válido,
      // lo conservamos.
      if (
        colorActual &&
        coloresDisponibles.includes(colorActual)
      ) {

        // El color actual sigue siendo válido.

      } else {

        // El color actual ya no sirve.
        // Elegimos automáticamente el primero disponible.

        productModalBody
          .querySelectorAll(".color-option")
          .forEach(btn => {
            btn.classList.remove("selected");
            btn.disabled = false;
            btn.removeAttribute("disabled");
          });


        if (coloresDisponibles.length > 0) {

          const nuevoColor = coloresDisponibles[0];

          const colorButton =
            productModalBody.querySelector(
              `.color-option[data-color="${CSS.escape(nuevoColor)}"]`
            );

          if (colorButton) {
            colorButton.classList.add("selected");
          }
        }
      }


      actualizarOpcionesDisponibles();
      actualizarLimiteCantidad();
      actualizarBotonAnadirCarrito();

      return;
    }

  });
}


// =====================================================
// CERRAR MODAL
// =====================================================

const closeProductModal =
  document.getElementById("closeProductModal");

const productModal =
  document.getElementById("productModal");


if (closeProductModal && productModal) {

  closeProductModal.addEventListener("click", () => {
    productModal.hidden = true;
  });

}


if (productModal) {

  productModal.addEventListener("click", (e) => {

    if (e.target === productModal) {
      productModal.hidden = true;
    }

  });

                                     }


// Control de cantidad con límite de stock
if (productModalBody) {
  productModalBody.addEventListener("click", (e) => {
    const minusButton = e.target.closest(".quantity-minus");
    const plusButton = e.target.closest(".quantity-plus");
    if (!currentProduct) return;
    const quantityValue =
      productModalBody.querySelector(".quantity-value");
    if (!quantityValue) return;
    let quantity =
      parseInt(quantityValue.textContent, 10) || 1;
    if (minusButton) {
      quantity = Math.max(1, quantity - 1);    }
    if (plusButton) {
      if (plusButton) {
  quantity++;
      }
    }
    quantityValue.textContent = quantity;
    actualizarLimiteCantidad();
  });
}
  // Añadir producto desde el panel
if (productModalBody) {
  productModalBody.addEventListener("click", (e) => {
    const addButton = e.target.closest(".add-product-to-cart");
    if (!addButton || !currentProduct) return;
    // Cantidad
    const quantityElement =
      productModalBody.querySelector(".quantity-value");
    const quantity =
      parseInt(quantityElement?.textContent, 10) || 1;
    // Color
    const selectedColor =
      productModalBody.querySelector(".color-option.selected");
    const color = selectedColor
      ? selectedColor.dataset.color
      : null;
    // Talla
    const selectedSize =
      productModalBody.querySelector(".size-option.selected");
    const size = selectedSize
      ? selectedSize.dataset.size
      : null;
    // Añadir al carrito
    addToCart(
      currentProduct.id,
      quantity,
      color,
      size
    );
    renderCart();
  });
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

const categoryFilter = document.getElementById("categoryFilter");
if (categoryFilter) {
  categoryFilter.addEventListener("change", (e) => {
    const selected = e.target.value;
    renderProducts(selected);   // muestra solo la categoría elegida
    renderCart();               // refresca el carrito si hace falta
  });
}
 function addToCart(id, quantity = 1, color = null, size = null) {
  const product = products.find(p => p.id === Number(id));
  if (!product) return;
  // Buscar la misma combinación de producto + color + talla
  const existing = cart.find(item =>
    item.id === product.id &&
    (item.color || null) === color &&
    (item.size || null) === size
  );
  if (existing) {
    // Si ya existe, aumentar su cantidad
    existing.qty += quantity;
  } else {
    // Si no existe, crear una nueva línea
    const newItem = {
      id: product.id,
      name: product.name,
      qty: quantity,
      price: product.price
    };
    if (color) {
      newItem.color = color;
    }
    if (size) {
      newItem.size = size;
    }
    cart.push(newItem);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
   actualizarBotonAnadirCarrito();
 }
function removeFromCart(index) {
  if (index < 0 || index >= cart.length) return;
  // Quitar una sola unidad
  cart[index].qty -= 1;
  // Si llega a 0, eliminar esa línea
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
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

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong><br>
        <small>
        ${item.qty} × ${money(item.price)} = ${money(item.price * item.qty)}
        </small>
        ${item.color ? `
        <br>
        <small>Color: ${item.color}</small>
        ` : ""}
        ${item.size ? `
        <br>
        <small>Talla: ${item.size}</small>
        ` : ""}
        
      </div>
      <button
      class="remove-btn"
      onclick="removeFromCart(${index})">
      Quitar
      </button>
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
  `<p>
    ${item.name}
    ${item.color ? `- Color: ${item.color}` : ""}
    ${item.size ? `- Talla: ${item.size}` : ""}
    - Cantidad: ${item.qty}
    = ${money(item.price * item.qty)}
  </p>`
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
  `- ${item.name}` +
  `${item.color ? ` | Color: ${item.color}` : ""}` +
  `${item.size ? ` | Talla: ${item.size}` : ""}` +
  ` | Cantidad: ${item.qty}` +
  ` | ${money(item.price * item.qty)}`
);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const message =
    `Hola Kepler, mi nombre es ${name}.\n\nQuiero hacer este pedido:\n\n${lines.join("\n")}\n\nTotal: ${money(total)}`;
  
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");

cart = [];
localStorage.setItem("cart", JSON.stringify(cart));
renderCart();

reservationForm.hidden = true;
customerName.value = "";
});

cancelReservation.addEventListener("click", () => {
  reservationForm.hidden = true;
  customerName.value = "";
});

// --- Sistema de selección de estrellas ---
document.addEventListener("click", async (e) => {

  // Detectar exactamente la estrella pulsada
  const clickedStar = e.target.closest("#reviewBox .review-stars span");

  if (!clickedStar) return;

  const starBox = clickedStar.parentElement;

  // Comprobar si el usuario está conectado
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    alert("Debes iniciar sesión para poder valorar este producto.");
    return;
  }

  // Saber qué estrella se pulsó
  const clickedIndex = Array.from(starBox.children).indexOf(clickedStar);

  if (clickedIndex === -1) return;

  const rating = clickedIndex + 1;

  // Guardar valoración
  const reviewBox = document.getElementById("reviewBox");

  if (reviewBox) {
    reviewBox.dataset.rating = rating;
  }

  // Cambiar visualmente las estrellas
  Array.from(starBox.children).forEach((star, index) => {
    star.textContent = index < rating ? "★" : "☆";
  });

});
// --- Abrir panel de reseña al tocar estrellas ---
document.addEventListener("click", (e) => {

  const ratingStars = e.target.closest("#productRating .rating-stars");

  if (!ratingStars) return;

  const reviewBox = document.getElementById("reviewBox");

  if (!reviewBox) return;

  reviewBox.hidden = false;
  reviewBox.style.display = "block";
reviewBox.style.position = "fixed";
reviewBox.style.top = "50%";
reviewBox.style.left = "50%";
reviewBox.style.transform = "translate(-50%, -50%)";
reviewBox.style.background = "white";
reviewBox.style.zIndex = "99999";
reviewBox.style.padding = "20px";
reviewBox.style.borderRadius = "20px";

});

document.addEventListener("click", (e) => {

  if (e.target.id !== "closeReviewBox") return;

  const reviewBox = document.getElementById("reviewBox");

  if (reviewBox) {
    reviewBox.hidden = true;
    reviewBox.style.display = "none";
  }

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
    actualizarBotonUsuario();

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

  const { data: { session } } =
    await supabaseClient.auth.getSession();

  if (!session) {
    loginBtn.className = "";
    loginBtn.innerHTML = "SESIÓN";
    loginBtn.style.background = "black";
    return;
  }

  const user = session.user;

  const nombre =
    user.user_metadata.name || "Usuario";

  const avatarUrl =
    user.user_metadata.avatar_url;

  loginBtn.className = "user-avatar";

  if (avatarUrl) {

    loginBtn.innerHTML = "";

    const img = document.createElement("img");

    img.src = avatarUrl + "?t=" + Date.now();
    img.alt = "Foto de perfil";

    loginBtn.appendChild(img);

    loginBtn.style.background = "transparent";

  } else {

    const inicial =
      nombre.charAt(0).toUpperCase();

    const colores = [
      "#3498db",
      "#9b59b6",
      "#e67e22",
      "#16a085",
      "#e74c3c"
    ];

    const color =
      colores[Math.floor(Math.random() * colores.length)];

    loginBtn.innerHTML = "";
    loginBtn.style.background = color;
    loginBtn.textContent = inicial;
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
      cargarPerfil();
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
  actualizarBotonUsuario();
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
      loginBtn.textContent = "SESIÓN";
      loginBtn.className = "";
      loginBtn.style.background = "black";
    }
  });
}
// --- Cargar datos del perfil ---

async function cargarPerfil() {

  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) return;

  const nombre = user.user_metadata.name || "";
  const apellido = user.user_metadata.surname || "";
  const profileAvatar = document.getElementById("profileAvatar");
  if (profileAvatar) {
    const avatarUrl = user.user_metadata.avatar_url;

  if (avatarUrl) {
    profileAvatar.innerHTML =
      `<img src="${avatarUrl}?t=${Date.now()}" alt="Foto de perfil">`;
  } else {
    const inicial = nombre.charAt(0).toUpperCase();

    profileAvatar.innerHTML = "";
    profileAvatar.textContent = inicial;
  }

  }
  const profileName = document.getElementById("profileName");
  const profileSurname = document.getElementById("profileSurname");
  const profileEmail = document.getElementById("profileEmail");

  if (profileName) {
    profileName.textContent = "Nombre: " + nombre;
  }

  if (profileSurname) {
    profileSurname.textContent = "Apellido: " + apellido;
  }

  if (profileEmail) {
    profileEmail.textContent = "Email: " + user.email;
  }
}
// --- Cambiar foto de perfil ---
const changePhotoBtn = document.getElementById("changePhotoBtn");
const profilePhotoInput = document.getElementById("profilePhotoInput");
// Abrir selector de archivos
if (changePhotoBtn && profilePhotoInput) {
  changePhotoBtn.addEventListener("click", () => {
    profilePhotoInput.click();
  });
}
async function subirFotoPerfil(file) {
  if (!file) return;
  // Solo JPG y PNG
  if (
    file.type !== "image/jpeg" &&
    file.type !== "image/png"
  ) {
    alert("Solo puedes utilizar imágenes JPG o PNG.");
    return;
  }
  // Obtener usuario
  const { data: { user }, error: userError } =
    await supabaseClient.auth.getUser();
  if (userError || !user) {
    alert("Debes iniciar sesión para cambiar tu foto.");
    return;
  }
  // Crear imagen
  const img = new Image();
  img.onload = async () => {
    // Crear canvas de 100x100
    const canvas = document.createElement("canvas");
    canvas.width = 100;    
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    // Mantener proporción y recortar al centro
    const size = Math.min(img.width, img.height);
    const sx = (img.width - size) / 2;
    const sy = (img.height - size) / 2;
    ctx.drawImage(
      img,
      sx,
      sy,
      size,
      size,
      0,
      0,
      100,
      100
    );
    // Convertir a JPG comprimido
    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert("No se pudo procesar la imagen.");
        return;
      }
      // Nombre único para cada usuario
      const fileName = user.id + ".jpg";
      // Subir imagen redimensionada
      const { error: uploadError } =
        await supabaseClient.storage
          .from("avatars")
          .upload(fileName, blob, {
            upsert: true,
            contentType: "image/jpeg"
          });
      if (uploadError) {
        console.error("Error al subir la foto:", uploadError);
        alert(
          "No se pudo subir la foto: " +
          uploadError.message
        );
        return;
      }
      // Obtener URL pública
      const { data: publicUrlData } =
        supabaseClient.storage
          .from("avatars")
          .getPublicUrl(fileName);
      const photoUrl = publicUrlData.publicUrl;
      // Mostrar foto nueva
      const profileAvatar = document.getElementById("profileAvatar");

if (profileAvatar) {
  profileAvatar.innerHTML =
    `<img src="${photoUrl}?t=${Date.now()}" alt="Foto de perfil">`;
}

// Guardar la foto en el usuario
const { data: updatedUser, error: updateError } =
  await supabaseClient.auth.updateUser({
    data: {
      avatar_url: photoUrl
    }
  });

if (updateError) {
  console.error("Error guardando avatar:", updateError);
  alert("La foto se subió, pero no se pudo guardar en tu perfil.");
  return;
}

// Mostrar inmediatamente la foto en el botón superior
if (loginBtn) {
  loginBtn.className = "user-avatar";
  loginBtn.innerHTML =
    `<img src="${photoUrl}?t=${Date.now()}" alt="Foto de perfil">`;
  loginBtn.style.background = "transparent";
}

alert("Foto de perfil actualizada correctamente.");
      alert("Foto de perfil actualizada correctamente.");
    }, "image/jpeg", 0.85);
    // Liberar memoria
    URL.revokeObjectURL(img.src);
  };
  img.onerror = () => {
    alert("No se pudo procesar la imagen.");
  };
  // Cargar archivo seleccionado
  img.src = URL.createObjectURL(file);
}
// Cuando selecciona un archivo
if (profilePhotoInput) {
  profilePhotoInput.addEventListener("change", async () => {
    const file = profilePhotoInput.files[0];
    await subirFotoPerfil(file);
    profilePhotoInput.value = "";  });
}
