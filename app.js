// Check authentication state on page load
document.addEventListener("DOMContentLoaded", function () {
  updateAuthUI();
  initializeCart();
});

// Cart Management Functions
let cart = [];

// Function to initialize the cart
function initializeCart() {
  // Try to load cart from localStorage if user is logged in
  if (isLoggedIn()) {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
        updateCartUI();
      } catch (e) {
        console.error("Error parsing cart data:", e);
        cart = [];
      }
    }
  }

  // Add event listeners for cart UI
  setupCartEventListeners();
}

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem("token") && localStorage.getItem("user");
}

// Setup cart event listeners
function setupCartEventListeners() {
  // Cart icon click to open cart
  const cartIcon = document.querySelector(".cart-icon-container");
  if (cartIcon) {
    cartIcon.addEventListener("click", openCart);
  }

  // Close cart button
  const closeCartBtn = document.querySelector(".close-cart");
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", closeCart);
  }

  // Continue shopping button
  const continueShoppingBtn = document.querySelector(".continue-shopping-btn");
  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener("click", closeCart);
  }

  // Checkout button
  const checkoutBtn = document.querySelector(".cart-checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", proceedToCheckout);
  }

  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", handleAddToCart);
  });
}

// Handle add to cart button click
function handleAddToCart(event) {
  if (!isLoggedIn()) {
    alert("Please log in to add items to your cart.");
    return;
  }

  const button = event.target;
  const id = button.getAttribute("data-id");
  const title = button.getAttribute("data-title");
  const price = parseFloat(button.getAttribute("data-price"));
  const img = button.getAttribute("data-img");
  // Get color information, default to 1 if not specified
  const color = button.getAttribute("data-color") || "1";

  addToCart({
    id,
    title,
    price,
    img,
    color,
    quantity: 1,
  });
}

// Add item to cart
function addToCart(item) {
  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.id === item.id
  );

  if (existingItemIndex !== -1) {
    // Increase quantity if item already exists
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new item to cart
    cart.push(item);
  }

  // Save cart to localStorage
  saveCart();

  // Update UI
  updateCartUI();

  // Show confirmation
  showToast("Item added to cart!");
}

// Show toast message
function showToast(message) {
  // Create toast element if it doesn't exist
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  // Set message and show
  toast.textContent = message;
  toast.classList.add("show");

  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Remove item from cart
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  updateCartUI();
}

// Update item quantity
function updateQuantity(id, change) {
  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    cart[itemIndex].quantity += change;

    // Remove item if quantity is 0 or less
    if (cart[itemIndex].quantity <= 0) {
      removeFromCart(id);
      return;
    }

    saveCart();
    updateCartUI();
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart UI
function updateCartUI() {
  // Update cart count
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
  }

  // Update cart items
  const cartItemsContainer = document.querySelector(".cart-items");
  const emptyCartMessage = document.querySelector(".cart-empty-message");

  if (cartItemsContainer && emptyCartMessage) {
    // Clear existing cart items
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      // Show empty cart message
      cartItemsContainer.style.display = "none";
      emptyCartMessage.style.display = "block";
      document.querySelector(".cart-footer").style.display = "none";
    } else {
      // Hide empty cart message
      cartItemsContainer.style.display = "block";
      emptyCartMessage.style.display = "none";
      document.querySelector(".cart-footer").style.display = "block";

      // Add cart items
      cart.forEach((item) => {
        const cartItemElement = document.createElement("div");
        cartItemElement.className = "cart-item";
        cartItemElement.innerHTML = `
                    <img src="${item.img}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                `;

        cartItemsContainer.appendChild(cartItemElement);
      });

      // Add event listeners for quantity buttons and remove buttons
      document.querySelectorAll(".decrease-quantity").forEach((button) => {
        button.addEventListener("click", () => {
          updateQuantity(button.getAttribute("data-id"), -1);
        });
      });

      document.querySelectorAll(".increase-quantity").forEach((button) => {
        button.addEventListener("click", () => {
          updateQuantity(button.getAttribute("data-id"), 1);
        });
      });

      document.querySelectorAll(".remove-item").forEach((button) => {
        button.addEventListener("click", () => {
          removeFromCart(button.getAttribute("data-id"));
        });
      });

      // Update total amount
      const totalAmount = document.querySelector(".total-amount");
      if (totalAmount) {
        const total = cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        totalAmount.textContent = `$${total.toFixed(2)}`;
      }
    }
  }
}

// Open cart overlay
function openCart() {
  if (!isLoggedIn()) {
    alert("Please log in to view your cart.");
    return;
  }

  const cartOverlay = document.querySelector(".cart-overlay");
  if (cartOverlay) {
    updateCartUI(); // Ensure cart is up to date
    cartOverlay.style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent scrolling while cart is open
  }
}

// Close cart overlay
function closeCart() {
  const cartOverlay = document.querySelector(".cart-overlay");
  if (cartOverlay) {
    cartOverlay.style.display = "none";
    document.body.style.overflow = "auto"; // Restore scrolling
  }
}

// Proceed to checkout
function proceedToCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty. Add some items before checking out.");
    return;
  }

  // Save cart data to be used in checkout page
  localStorage.setItem(
    "checkoutData",
    JSON.stringify({
      items: cart,
      total: cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    })
  );

  // Redirect to checkout page
  window.location.href = "checkout.html";
}

// Function to update authentication UI based on login state
function updateAuthUI() {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const authButtons = document.querySelector(".auth-buttons");
  const userProfile = document.querySelector(".user-profile");
  const usernameElement = document.querySelector(".username");

  if (token && userString) {
    try {
      // User is logged in
      const user = JSON.parse(userString);

      // Display username
      usernameElement.textContent = `Welcome, ${user.username}`;

      // Show user profile, hide auth buttons
      authButtons.style.display = "none";
      userProfile.style.display = "flex";
    } catch (error) {
      console.error("Error parsing user data:", error);
      resetAuthState();
    }
  } else {
    // User is not logged in
    authButtons.style.display = "flex";
    userProfile.style.display = "none";

    // Clear cart if user is logged out
    cart = [];
    updateCartUI();
  }
}

// Function to reset auth state (logout)
function resetAuthState() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  cart = [];
  updateAuthUI();
}

// Logout button handler
document.querySelector(".logoutBtn")?.addEventListener("click", function () {
  resetAuthState();
  alert("You have been logged out successfully");
});

// Mobile menu toggle
document
  .querySelector(".hamburger-menu")
  .addEventListener("click", function () {
    document.querySelector(".navBottom").classList.toggle("active");

    // Animate hamburger menu
    const bars = document.querySelectorAll(".hamburger-menu span");
    bars.forEach((bar) => bar.classList.toggle("active"));
  });

// Login and Signup button handlers
document.querySelector(".loginBtn").addEventListener("click", function () {
  window.location.href = "login.html";
});

document.querySelector(".signupBtn").addEventListener("click", function () {
  window.location.href = "register.html";
});

// Close mobile menu when clicking a menu item
document.querySelectorAll(".menuItem").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelector(".navBottom").classList.remove("active");
  });
});

const wrapper = document.querySelector(".sliderWrapper");
const menuItems = document.querySelectorAll(".menuItem");

const products = [
  {
    id: 1,
    title: "Air Force",
    price: 119,
    colors: [
      {
        code: "black",
        img: "./image/air.png",
      },
      {
        code: "darkblue",
        img: "./image/air2.png",
      },
    ],
  },
  {
    id: 2,
    title: "Air Jordan",
    price: 149,
    colors: [
      {
        code: "lightgray",
        img: "./image/jordan.png",
      },
      {
        code: "green",
        img: "./image/jordan2.png",
      },
    ],
  },
  {
    id: 3,
    title: "Blazer",
    price: 109,
    colors: [
      {
        code: "lightgray",
        img: "./image/blazer.png",
      },
      {
        code: "green",
        img: "./image/blazer2.png",
      },
    ],
  },
  {
    id: 4,
    title: "Crater",
    price: 129,
    colors: [
      {
        code: "black",
        img: "./image/crater.png",
      },
      {
        code: "lightgray",
        img: "./image/crater2.png",
      },
    ],
  },
  {
    id: 5,
    title: "Hippie",
    price: 99,
    colors: [
      {
        code: "gray",
        img: "./image/hippie.png",
      },
      {
        code: "black",
        img: "./image/hippie2.png",
      },
    ],
  },
];

let choosenProduct = products[0];

const currentProductImg = document.querySelector(".productImg");
const currentProductTitle = document.querySelector(".productTitle");
const currentProductPrice = document.querySelector(".productPrice");
const currentProductColors = document.querySelectorAll(".color");
const currentProductSizes = document.querySelectorAll(".size");

menuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    // Change the current slide
    wrapper.style.transform = `translateX(${-100 * index}vw)`;

    // Change the chosen product
    choosenProduct = products[index];

    // Change texts of currentProduct
    currentProductTitle.textContent = choosenProduct.title;
    currentProductPrice.textContent = "$" + choosenProduct.price;
    currentProductImg.src = choosenProduct.colors[0].img;

    // Assign new colors
    currentProductColors.forEach((color, index) => {
      color.style.backgroundColor = choosenProduct.colors[index].code;
    });

    // Update add to cart button to match the current product
    const productButton = document.querySelector(".productButton");
    if (productButton) {
      productButton.setAttribute("data-id", choosenProduct.id);
      productButton.setAttribute("data-title", choosenProduct.title);
      productButton.setAttribute("data-price", choosenProduct.price);
      productButton.setAttribute("data-img", choosenProduct.colors[0].img);
      productButton.setAttribute("data-color", "1");
    }

    // Reset color selection borders
    currentProductColors.forEach((color, i) => {
      color.style.border = i === 0 ? "2px solid black" : "none";
      color.setAttribute("data-img", choosenProduct.colors[i].img);
      color.setAttribute("data-color", (i + 1).toString());
    });
  });
});

currentProductColors.forEach((color, index) => {
  color.addEventListener("click", () => {
    // Update product image
    const colorImg = color.getAttribute("data-img");
    currentProductImg.src = colorImg;

    // Update add to cart button data attributes
    const productButton = document.querySelector(".productButton");
    if (productButton) {
      productButton.setAttribute("data-img", colorImg);
      productButton.setAttribute(
        "data-color",
        color.getAttribute("data-color")
      );
    }

    // Highlight selected color
    currentProductColors.forEach((c) => (c.style.border = "none"));
    color.style.border = "2px solid black";
  });
});

currentProductSizes.forEach((size, index) => {
  size.addEventListener("click", () => {
    currentProductSizes.forEach((size) => {
      size.style.backgroundColor = "white";
      size.style.color = "black";
    });
    size.style.backgroundColor = "black";
    size.style.color = "white";
  });
});

const productButton = document.querySelector(".productButton");
if (productButton) {
  productButton.addEventListener("click", handleAddToCart);
}

const payment = document.querySelector(".payment");
const close = document.querySelector(".close");

close.addEventListener("click", () => {
  payment.style.display = "none";
});

// ===== Confirmation Screen Code =====
const payButton = document.querySelector(".payButton");
const confirmationScreen = document.getElementById("confirmationScreen");
const closeConfirmation = document.getElementById("closeConfirmation");

// Show the confirmation screen when the Checkout button is clicked
payButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form submission for demo

  // Validate inputs
  const phoneInput = document.querySelector('input[type="tel"]');
  const cardInput = document.querySelector('input[placeholder="Card Number"]');
  const monthInput = document.querySelector('input[placeholder="MM"]');
  const yearInput = document.querySelector('input[placeholder="YYYY"]');
  const cvvInput = document.querySelector('input[placeholder="CVV"]');

  if (!/^\d{10}$/.test(phoneInput.value)) {
    alert("Phone number must be exactly 10 digits.");
    return;
  }

  if (!/^\d{16}$/.test(cardInput.value)) {
    alert("Card number must be exactly 16 digits.");
    return;
  }

  if (!/^\d{2}$/.test(monthInput.value) || parseInt(monthInput.value) > 12) {
    alert("Month must be 2 digits and between 01 and 12.");
    return;
  }

  if (!/^\d{4}$/.test(yearInput.value)) {
    alert("Year must be 4 digits.");
    return;
  }

  if (!/^\d{3}$/.test(cvvInput.value)) {
    alert("CVV must be exactly 3 digits.");
    return;
  }

  // Clear the cart after successful checkout
  cart = [];
  saveCart();
  updateCartUI();

  // Show confirmation screen
  confirmationScreen.style.display = "block";
});

// Close the confirmation screen when the Close button is clicked
closeConfirmation.addEventListener("click", function () {
  confirmationScreen.style.display = "none";
});

// Add toast style to the document
const style = document.createElement("style");
style.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
        z-index: 9999;
    }
    
    .toast.show {
        opacity: 1;
        visibility: visible;
    }
`;
document.head.appendChild(style);
