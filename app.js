// --- CONFIGURATION ---
const phoneNumber = "15551234567"; // PUT YOUR NUMBER HERE (No spaces or dashes)

// --- INVENTORY ---
// To add an image, upload it to GitHub and use "images/filename.jpg"
const products = [
    {
        id: 1,
        name: "Blue Razz 5000 Puff",
        price: 25,
        stock: 10,
        image: "https://via.placeholder.com/150/000000/FFFFFF?text=Blue+Razz" 
    },
    {
        id: 2,
        name: "Strawberry Cart (1g)",
        price: 40,
        stock: 5,
        image: "https://via.placeholder.com/150/000000/FFFFFF?text=Straw+Cart"
    },
    {
        id: 3,
        name: "Battery Stick",
        price: 15,
        stock: 0, // 0 = Out of Stock
        image: "https://via.placeholder.com/150/000000/FFFFFF?text=Battery"
    },
    {
        id: 4,
        name: "Mint Ice Vape",
        price: 22,
        stock: 8,
        image: "https://via.placeholder.com/150/000000/FFFFFF?text=Mint+Ice"
    }
];

// --- APP LOGIC ---

let cart = [];

// 1. Load Products
const productList = document.getElementById('product-list');

function renderProducts() {
    productList.innerHTML = products.map(product => `
        <div class="card ${product.stock === 0 ? 'out-of-stock' : ''}">
            <img src="${product.image}" alt="${product.name}">
            <div class="card-details">
                <div>
                    <h3>${product.name}</h3>
                    <div class="stock">${product.stock > 0 ? product.stock + ' left' : 'SOLD OUT'}</div>
                </div>
                <div>
                    <div class="price">$${product.price}</div>
                    <button class="add-btn" onclick="addToCart(${product.id})">
                        ${product.stock > 0 ? 'ADD TO CART' : 'SOLD OUT'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 2. Cart Functions
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        if (existingItem.qty < product.stock) {
            existingItem.qty++;
        } else {
            alert("Max stock reached!");
        }
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.reduce((acc, item) => acc + item.qty, 0);
    
    const cartItems = document.getElementById('cart-items');
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-msg">Cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>${item.name} (x${item.qty})</div>
                <div>
                    $${item.price * item.qty} 
                    <button onclick="removeFromCart(${item.id})" style="color:red;background:none;border:none;margin-left:5px;">X</button>
                </div>
            </div>
        `).join('');
    }
    
    document.getElementById('cart-total').innerText = total.toFixed(2);
}

function toggleCart() {
    document.getElementById('cart-modal').classList.toggle('active');
}

// 3. Checkout Logic
function checkout() {
    if (cart.length === 0) return alert("Cart is empty!");
    
    const method = document.getElementById('payment-method').value;
    const total = document.getElementById('cart-total').innerText;
    
    // Create the message
    let message = `Hi! I'd like to place an order:%0A`;
    cart.forEach(item => {
        message += `- ${item.name} (x${item.qty})%0A`;
    });
    message += `%0ATotal: $${total}`;
    message += `%0APaying via: ${method}`;
    message += `%0A%0AWhen and where can we meet?`;

    // Open SMS app
    window.location.href = `sms:${phoneNumber}?&body=${message}`;
}

// 4. Age Gate
function enterSite() {
    localStorage.setItem('ageVerified', 'true');
    document.getElementById('age-gate').classList.remove('active');
}
function leaveSite() {
    window.location.href = "https://www.google.com";
}

// Check on load
if (!localStorage.getItem('ageVerified')) {
    document.getElementById('age-gate').classList.add('active');
}

// Init
renderProducts();
