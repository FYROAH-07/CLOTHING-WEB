
const products = [
    {
        id: 1,
        name: "Essential White Tee",
        category: "T-Shirts",
        price: 799,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "Classic Black Tee",
        category: "T-Shirts",
        price: 899,
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Everyday Overshirt",
        category: "Shirts",
        price: 1499,
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "Relaxed Fit Trousers",
        category: "Trousers",
        price: 1799,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "Minimal Everyday Jacket",
        category: "Jackets",
        price: 2499,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "Smart Casual Shirt",
        category: "Shirts",
        price: 1299,
        image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=700&q=80"
    }
];

// Store elements
const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const wishlistFilter = document.getElementById("wishlist-filter");

const cartButton = document.getElementById("cart-button");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const closeCartButton = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

const checkoutButton = document.getElementById("checkout-button");
const checkoutModal = document.getElementById("checkout-modal");
const closeCheckoutButton = document.getElementById("close-checkout");
const checkoutSummary = document.getElementById("checkout-summary");
const demoName = document.getElementById("demo-name");
const placeDemoOrderButton = document.getElementById("place-demo-order");
const checkoutMessage = document.getElementById("checkout-message");

// Shopping state
const cart = {};
const wishlist = new Set();
let showWishlistOnly = false;

// Format prices in Indian rupees
function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

// Display products
function renderProducts(items) {
    productGrid.innerHTML = "";

    if (items.length === 0) {
        productGrid.innerHTML =
            '<p class="no-products">No products found. Try another search or category.</p>';
        return;
    }

    items.forEach(function (product) {
        const isWishlisted = wishlist.has(product.id);
        const isNewArrival = product.id === 1 || product.id === 3;

        const card = document.createElement("article");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image-wrap">
                ${isNewArrival
                    ? '<span class="new-arrival">NEW ARRIVAL</span>'
                    : ""}

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            </div>

            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3>${product.name}</h3>

                <span class="product-price">
                    ${formatPrice(product.price)}
                </span>

                <div class="product-actions">
                    <button type="button" data-add="${product.id}">
                        Add to bag
                    </button>

                    <button
                        type="button"
                        class="wishlist-button"
                        data-wishlist="${product.id}"
                        aria-label="${isWishlisted ? "Remove" : "Add"} ${product.name} ${isWishlisted ? "from" : "to"} wishlist"
                        aria-pressed="${isWishlisted}"
                    >
                        ${isWishlisted ? "♥" : "♡"}
                    </button>
                </div>
            </div>
        `;

        productGrid.appendChild(card);
    });
}

// Search, category and wishlist filtering
function filterProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredProducts = products.filter(function (product) {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const matchesWishlist =
            !showWishlistOnly || wishlist.has(product.id);

        return matchesSearch && matchesCategory && matchesWishlist;
    });

    // Helpful message when the wishlist is empty
    if (showWishlistOnly && filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="empty-wishlist">
                <p class="empty-wishlist-icon">♡</p>
                <h3>Your wishlist is waiting.</h3>
                <p>Save the pieces you love and find them here.</p>
                <button type="button" id="continue-shopping">
                    Continue shopping →
                </button>
            </div>
        `;
        return;
    }

    renderProducts(filteredProducts);
}

// Search and category events
searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

// Toggle wishlist view
wishlistFilter.addEventListener("click", function () {
    showWishlistOnly = !showWishlistOnly;

    wishlistFilter.textContent = showWishlistOnly
        ? "← All Products"
        : "♡ My Wishlist";

    filterProducts();
});

// Handle Continue Shopping
productGrid.addEventListener("click", function (event) {
    if (event.target.closest("#continue-shopping")) {
        showWishlistOnly = false;
        wishlistFilter.textContent = "♡ My Wishlist";
        searchInput.value = "";
        categoryFilter.value = "All";
        filterProducts();
    }
});

// Handle Add to Bag and Wishlist buttons
productGrid.addEventListener("click", function (event) {
    const addButton = event.target.closest("[data-add]");
    const wishlistButton = event.target.closest("[data-wishlist]");

    if (addButton) {
        const productId = Number(addButton.dataset.add);

        cart[productId] = (cart[productId] || 0) + 1;

        updateCart();

        addButton.textContent = "Added ✓";
        addButton.disabled = true;

        setTimeout(function () {
            addButton.textContent = "Add to bag";
            addButton.disabled = false;
        }, 900);
    }

    if (wishlistButton) {
        const productId = Number(wishlistButton.dataset.wishlist);

        if (wishlist.has(productId)) {
            wishlist.delete(productId);
        } else {
            wishlist.add(productId);
        }

        filterProducts();
    }
});

// Calculate total quantity in the bag
function getCartCount() {
    return Object.values(cart).reduce(function (total, quantity) {
        return total + quantity;
    }, 0);
}

// Calculate total price
function getCartTotal() {
    return products.reduce(function (total, product) {
        return total + product.price * (cart[product.id] || 0);
    }, 0);
}

// Update shopping bag display
function updateCart() {
    cartItems.innerHTML = "";

    const itemsInCart = products.filter(function (product) {
        return (cart[product.id] || 0) > 0;
    });

    cartCount.textContent = getCartCount();
    cartTotal.textContent = formatPrice(getCartTotal());

    if (itemsInCart.length === 0) {
        cartItems.innerHTML =
            "<p>Your bag is empty. Let's change that!</p>";

        checkoutButton.disabled = true;
        checkoutButton.style.opacity = "0.5";
        checkoutButton.style.cursor = "not-allowed";
        return;
    }

    checkoutButton.disabled = false;
    checkoutButton.style.opacity = "1";
    checkoutButton.style.cursor = "pointer";

    itemsInCart.forEach(function (product) {
        const quantity = cart[product.id];

        const item = document.createElement("div");
        item.className = "cart-item";

        item.innerHTML = `
            <div>
                <strong>${product.name}</strong>
                <p>${formatPrice(product.price)} each</p>

                <div class="quantity-controls">
                    <button
                        type="button"
                        data-cart-action="decrease"
                        data-id="${product.id}"
                        aria-label="Decrease ${product.name} quantity"
                    >−</button>

                    <span>${quantity}</span>

                    <button
                        type="button"
                        data-cart-action="increase"
                        data-id="${product.id}"
                        aria-label="Increase ${product.name} quantity"
                    >+</button>
                </div>
            </div>

            <div>
                <strong>${formatPrice(product.price * quantity)}</strong>
                <br>
                <button
                    type="button"
                    data-cart-action="remove"
                    data-id="${product.id}"
                >Remove</button>
            </div>
        `;

        cartItems.appendChild(item);
    });
}

// Handle quantity and Remove buttons
cartItems.addEventListener("click", function (event) {
    const button = event.target.closest("[data-cart-action]");

    if (!button) return;

    const productId = Number(button.dataset.id);
    const action = button.dataset.cartAction;

    if (action === "increase") {
        cart[productId] = (cart[productId] || 0) + 1;
    }

    if (action === "decrease") {
        cart[productId] = (cart[productId] || 0) - 1;

        if (cart[productId] <= 0) {
            delete cart[productId];
        }
    }

    if (action === "remove") {
        delete cart[productId];
    }

    updateCart();
});

// Open and close the shopping bag
function openCart() {
    cartPanel.classList.add("open");
    cartOverlay.classList.add("open");
    cartPanel.setAttribute("aria-hidden", "false");
    closeCartButton.focus();
}

function closeCart() {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
    cartButton.focus();
}

cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Open demo checkout
checkoutButton.addEventListener("click", function () {
    if (getCartCount() === 0) return;

    checkoutSummary.textContent =
        `${getCartCount()} item(s) in your bag. Total: ${formatPrice(getCartTotal())}.`;

    checkoutMessage.textContent = "";
    demoName.value = "";

    checkoutModal.hidden = false;
    closeCart();
    closeCheckoutButton.focus();
});

// Close demo checkout
function closeCheckout() {
    checkoutModal.hidden = true;
    checkoutMessage.textContent = "";
}

closeCheckoutButton.addEventListener("click", closeCheckout);

checkoutModal.addEventListener("click", function (event) {
    if (event.target === checkoutModal) {
        closeCheckout();
    }
});

// Complete a demo checkout — no real order or payment
placeDemoOrderButton.addEventListener("click", function () {
    const itemCount = getCartCount();

    if (itemCount <= 0) {
        checkoutMessage.textContent =
            "Your bag is empty. Please add a product before checkout.";
        return;
    }

    const customerName = demoName.value.trim();
    const greeting = customerName
        ? `Thank you, ${customerName}!`
        : "Thank you!";

    const orderTotal = formatPrice(getCartTotal());

    checkoutMessage.textContent =
        `${greeting} Your demo checkout is complete. ` +
        `${itemCount} item(s), total ${orderTotal}. ` +
        "No real order was placed and no payment was taken.";

    // Clear the bag after demo checkout
    Object.keys(cart).forEach(function (id) {
        delete cart[id];
    });

    updateCart();
});

// Close overlays with Escape
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        if (!checkoutModal.hidden) {
            closeCheckout();
        } else if (cartPanel.classList.contains("open")) {
            closeCart();
        }
    }
});

// Initial setup
renderProducts(products);
updateCart();
cartPanel.setAttribute("aria-hidden", "true");
