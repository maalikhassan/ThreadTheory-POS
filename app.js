// 1. Mock Data: This replaces a database for now
const products = [
    { id: 1, name: "Classic White Shirt", price: 25.00, category: "Shirts", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Slim Fit Jeans", price: 40.00, category: "Pants", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Leather Belt", price: 15.00, category: "Accessories", image: "https://via.placeholder.com/150" },
    { id: 4, name: "Graphic Tee", price: 20.00, category: "Shirts", image: "https://via.placeholder.com/150" }
];

// 2. State Management: Keeping track of what's in the cart
let cart = [];

// 3. Select DOM Elements
const productGrid = document.getElementById('productGrid');
const cartItemsContainer = document.getElementById('cartItems');
const discountInput = document.getElementById('discountInput');

// 4. Add event listener for discount input
discountInput.addEventListener('input', renderCart);

// 4. Function to display products
function displayProducts(filter = "All") {
    productGrid.innerHTML = ""; // Clear current display

    products.forEach(product => {
        // Filter logic
        if (filter === "All" || product.category === filter) {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p>$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})">Add to Order</button>
            `;
            productGrid.appendChild(card);
        }
    });
}

// 5. Add to Cart Function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    renderCart();
}

// 6. Function to update the Cart UI
function renderCart() {
    cartItemsContainer.innerHTML = "";
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
            <button onclick="removeFromCart(${index})">X</button>
        `;
        cartItemsContainer.appendChild(div);
        subtotal += item.price;
    });
    
    // Update subtotal
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    
    // Calculate discount and final total
    const discountPercent = parseFloat(document.getElementById('discountInput').value) || 0;
    const discountAmount = (subtotal * discountPercent) / 100;
    const finalTotal = subtotal - discountAmount;
    
    document.getElementById('finalTotal').textContent = `$${finalTotal.toFixed(2)}`;
}

// 7. Remove from Cart Function
function removeFromCart(index) {
    cart.splice(index, 1); // Remove item at the given index
    renderCart(); // Update the cart display
}

// Initialize the display
displayProducts();