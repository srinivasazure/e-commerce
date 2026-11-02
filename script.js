// 1. Structural Device Catalog Array with Active Web Image Sources
const mobileProducts = [
    {
        id: 1,
        brand: "Samsung",
        title: "Galaxy S26 Ultra 5G",
        price: 139999,
        imgSrc: "https://conrad.com",
        fallbackImg: "https://unsplash.com",
        specs: { processor: "Snapdragon 8 Gen 5", display: "6.9-inch AMOLED", camera: "200MP Quad OIS", battery: "5500mAh + 45W", storage: "16GB | 256GB" }
    },
    {
        id: 2,
        brand: "Apple",
        title: "iPhone 17 Pro Max",
        price: 159900,
        imgSrc: "https://amazon.in",
        fallbackImg: "https://unsplash.com",
        specs: { processor: "A19 Pro Silicon", display: "6.9-inch Retina", camera: "48MP Pro Fusion", battery: "4800mAh MagSafe", storage: "8GB | 256GB" }
    },
    {
        id: 3,
        brand: "OnePlus",
        title: "OnePlus 15 5G",
        price: 84999,
        imgSrc: "https://amazon.in",
        fallbackImg: "https://unsplash.com",
        specs: { processor: "Snapdragon 8 Elite", display: "6.78-inch 165Hz", camera: "Triple 50MP Hassel", battery: "7300mAh 100W", storage: "12GB | 256GB" }
    }
];

// 2. Global Runtime Application States
let shoppingCart = [];
let currentUser = null; // Holds authenticated user state structure

// 3. Document Node Mappings
const productsContainer = document.getElementById('products-container');
const cartItemsList = document.getElementById('cart-items');
const cartCountDisplay = document.getElementById('cart-count');
const cartTotalDisplay = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout');

const authNavBtn = document.getElementById('auth-nav-btn');
const authModal = document.getElementById('auth-modal');
const authForm = document.getElementById('auth-form');
const closeModalBtn = document.getElementById('close-modal-btn');
const authEmailInput = document.getElementById('auth-email');

// 4. Render Layout Framework Loops
function displayDevicesStore() {
    productsContainer.innerHTML = '';
    mobileProducts.forEach(phone => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-frame">
                <img src="${phone.fallbackImg}" alt="${phone.title}">
            </div>
            <div class="product-info">
                <span class="brand-badge">${phone.brand}</span>
                <h3 class="product-title">${phone.title}</h3>
                <p class="product-price">₹${phone.price.toLocaleString('en-IN')}</p>
                <div class="specs-panel">
                    <div class="spec-item"><span class="spec-label">Processor:</span><span>${phone.specs.processor}</span></div>
                    <div class="spec-item"><span class="spec-label">Display:</span><span>${phone.specs.display}</span></div>
                    <div class="spec-item"><span class="spec-label">Camera:</span><span>${phone.specs.camera}</span></div>
                    <div class="spec-item"><span class="spec-label">Battery:</span><span>${phone.specs.battery}</span></div>
                    <div class="spec-item"><span class="spec-label">Storage:</span><span>${phone.specs.storage}</span></div>
                </div>
                <button class="add-to-cart-btn" onclick="pushToCart(${phone.id})">Add to Cart</button>
            </div>
        `;
        productsContainer.appendChild(card);
    });
}

// 5. App Logic: Shopping Workflow Operations
window.pushToCart = function(phoneId) {
    const chosenPhone = mobileProducts.find(item => item.id === phoneId);
    const standardExist = shoppingCart.find(item => item.id === phoneId);
    if (standardExist) { standardExist.quantity += 1; } else { shoppingCart.push({ ...chosenPhone, quantity: 1 }); }
    synchronizeCartUI();
};

window.pullFromCart = function(phoneId) {
    shoppingCart = shoppingCart.filter(item => item.id !== phoneId);
    synchronizeCartUI();
};

function synchronizeCartUI() {
    cartItemsList.innerHTML = '';
    let qty = 0; let total = 0;
    shoppingCart.forEach(item => {
        qty += item.quantity; total += (item.price * item.quantity);
        const row = document.createElement('li');
        row.className = 'cart-item';
        row.innerHTML = `<div><strong>${item.title}</strong><br><small>₹${item.price.toLocaleString('en-IN')} x ${item.quantity}</small></div>
                         <div><span>₹${(item.price * item.quantity).toLocaleString('en-IN')}</span><button class="cart-item-remove" onclick="pullFromCart(${item.id})">×</button></div>`;
        cartItemsList.appendChild(row);
    });
    cartCountDisplay.textContent = qty;
    cartTotalDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;
}

// 6. Authentication Handling Logic
authNavBtn.addEventListener('click', () => {
    if (currentUser) {
        // Logout Execution Sequence
        currentUser = null;
        authNavBtn.textContent = "Log In";
        alert("Logged out successfully.");
    } else {
        // Open Login Drawer Panel Modals
        authModal.classList.add('active');
    }
});

closeModalBtn.addEventListener('click', () => {
    authModal.classList.remove('active');
});

authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailValue = authEmailInput.value;
    currentUser = { email: emailValue };
    authNavBtn.textContent = "Logout (" + emailValue.split('@')[0] + ")";
    authForm.reset();
    authModal.classList.remove('active');
    alert("Authentication validation successful! You can now checkout your basket contents.");
});

// 7. Protected Route Interception Logic
checkoutBtn.addEventListener('click', () => {
    if (shoppingCart.length === 0) {
        alert("Your basket is empty.");
        return;
    }
    if (!currentUser) {
        alert("🔒 Checkout Blocked! Please click the 'Log In' button at the top to complete account verification before checking out.");
        authModal.classList.add('active');
    } else {
        alert(`Order confirmed for ${currentUser.email}! Processing payment sequence...`);
        shoppingCart = [];
        synchronizeCartUI();
    }
});

// Initialise Application Loop Setup
displayDevicesStore();
