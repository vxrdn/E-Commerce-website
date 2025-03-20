// Mobile menu toggle
document.querySelector('.hamburger-menu').addEventListener('click', function() {
    document.querySelector('.navBottom').classList.toggle('active');
    
    // Animate hamburger menu
    const bars = document.querySelectorAll('.hamburger-menu span');
    bars.forEach(bar => bar.classList.toggle('active'));
});

// Login and Signup button handlers
document.querySelector('.loginBtn').addEventListener('click', function() {
    window.location.href = "login.html";
});

document.querySelector('.signupBtn').addEventListener('click', function() {
    window.location.href = "register.html";
});

// Close mobile menu when clicking a menu item
document.querySelectorAll('.menuItem').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.navBottom').classList.remove('active');
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
  });
});

currentProductColors.forEach((color, index) => {
  color.addEventListener("click", () => {
    currentProductImg.src = choosenProduct.colors[index].img;
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
const payment = document.querySelector(".payment");
const close = document.querySelector(".close");

productButton.addEventListener("click", () => {
  payment.style.display = "flex";
});

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

  // If all validations pass, show the confirmation screen
  confirmationScreen.style.display = "block";
});

// Close the confirmation screen when the Close button is clicked
closeConfirmation.addEventListener("click", function () {
  confirmationScreen.style.display = "none";
});