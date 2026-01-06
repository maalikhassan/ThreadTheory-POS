// ===========================================
// DATA STORAGE (Replaces a real database)
// ===========================================

// Products array - stores all items we can sell
let products = [
    { id: 1, name: "Classic White Shirt", price: 25.00, category: "Shirts", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Slim Fit Jeans", price: 40.00, category: "Pants", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Leather Belt", price: 15.00, category: "Accessories", image: "https://via.placeholder.com/150" },
    { id: 4, name: "Graphic Tee", price: 20.00, category: "Shirts", image: "https://via.placeholder.com/150" }
];

// Customers array - stores customer information
let customers = [
    { id: "C001", name: "Guest Customer", email: "guest@threadtheory.com" }
];

// Orders array - stores completed orders
let orders = [];

// Current cart - stores items being added to current order
let cart = [];

// Current customer for this order
let currentCustomer = null;

// Counter for generating new IDs
let nextProductId = 5;
let nextCustomerId = 2; // Start from 2 since we have C001
let nextOrderId = 1;

// ===========================================
// DOM ELEMENT REFERENCES
// ===========================================

// Store references to HTML elements we'll manipulate
const productGrid = document.getElementById('productGrid');
const cartItemsContainer = document.getElementById('cartItems');
const discountInput = document.getElementById('discountInput');
const customerSection = document.getElementById('customer-section');
const customerNameInput = document.getElementById('customerName');
const customerEmailInput = document.getElementById('customerEmail');
const customerTableBody = document.getElementById('customerTableBody');

// ===========================================
// INITIALIZATION
// ===========================================

// This function runs when the page loads
function initializeApp() {
    // Display all products on screen
    
    // Display existing customers in table
    renderCustomerTable();
    displayProducts("All");
    
    // Set up the discount input to recalculate when changed
    discountInput.addEventListener('input', updateCartDisplay);
}

// ===========================================
// PRODUCT FUNCTIONS (CRUD Operations)
// ===========================================

// READ: Display products on the screen with optional category filter
function displayProducts(filterCategory) {
    // Clear the product grid first
    productGrid.innerHTML = "";
    
    // Loop through each product in our products array
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        
        // Check if product matches the filter
        let shouldDisplay = false;
        if (filterCategory === "All") {
            shouldDisplay = true;
        } else if (product.category === filterCategory) {
            shouldDisplay = true;
        }
        
        // If product matches filter, create a card for it
        if (shouldDisplay) {
            // Create a new div element for the product card
            let card = document.createElement('div');
            card.className = 'product-card';
            
            // Set the HTML content of the card
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="category">${product.category}</p>
                <button onclick="addItemToCart(${product.id})">Add to Order</button>
            `;
            
            // Add the card to the product grid
            productGrid.appendChild(card);
        }
    }
}

// ===========================================
// CART FUNCTIONS
// ===========================================

// CREATE: Add a product to the current cart
function addItemToCart(productId) {
    // Loop through products to find the one with matching ID
    let foundProduct = null;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            foundProduct = products[i];
            break;
        }
    }
    
    // If product found, add it to cart
    if (foundProduct !== null) {
        cart.push(foundProduct);
        updateCartDisplay();
    }
}

// DELETE: Remove an item from cart by its position
function removeItemFromCart(cartIndex) {
    // Remove one item at the specified index
    cart.splice(cartIndex, 1);
    
    // Update the cart display
    updateCartDisplay();
}

// READ: Update the cart display and calculate totals
function updateCartDisplay() {
    // Clear current cart display
    cartItemsContainer.innerHTML = "";
    
    // Variable to track subtotal
    let subtotal = 0;
    
    // Loop through each item in cart
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        
        // Create a div for this cart item
        let itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        
        // Set the HTML for this item
        itemDiv.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
            <button onclick="removeItemFromCart(${i})">X</button>
        `;
        
        // Add the item to cart container
        cartItemsContainer.appendChild(itemDiv);
        
        // Add this item's price to subtotal
        subtotal = subtotal + item.price;
    }
    
    // Update subtotal display
    let subtotalElement = document.getElementById('subtotal');
    subtotalElement.textContent = "$" + subtotal.toFixed(2);
    
    // Get discount percentage from input
    let discountPercent = parseFloat(discountInput.value);
    if (isNaN(discountPercent)) {
        discountPercent = 0;
    }
    
    // Calculate discount amount
    let discountAmount = (subtotal * discountPercent) / 100;
    
    // Calculate final total
    let finalTotal = subtotal - discountAmount;
    
    // Update final total display
    let totalElement = document.getElementById('finalTotal');
    totalElement.textContent = "$" + finalTotal.toFixed(2);
}

// DELETE: Clear the entire cart
function clearCart() {
    cart = [];
    updateCartDisplay();
}

// CREATE: Place the current order
function placeOrder() {
    // Check if cart has items
    if (cart.length === 0) {
        alert("Cart is empty! Add items first.");
        return;
    }
    
    // Calculate order total
    let orderTotal = 0;
    for (let i = 0; i < cart.length; i++) {
        orderTotal = orderTotal + cart[i].price;
    }
    
    // Apply discount if any
    let discountPercent = parseFloat(discountInput.value);
    if (isNaN(discountPercent)) {
        discountPercent = 0;
    }
    let discountAmount = (orderTotal * discountPercent) / 100;
    orderTotal = orderTotal - discountAmount;
    
    // Create new order object
    let newOrder = {
        id: nextOrderId,
        items: cart.slice(), // Copy of cart items
        total: orderTotal,
        discount: discountPercent,
        customer: currentCustomer,
        date: new Date().toLocaleDateString()
    };
    
    // Add order to orders array
    orders.push(newOrder);
    nextOrderId = nextOrderId + 1;
    
    // Clear the cart
    clearCart();
   VIEW SWITCHING FUNCTIONS
// ===========================================

// Show the store/products view and hide customer section
function showStoreView() {
    // Show the product grid
    productGrid.style.display = "grid";
    
    // Hide the customer section
    customerSection.style.display = "none";
    
    // Update sidebar active state
    updateSidebarActive(0);
}

// Show the customer management view and hide product grid
function showCustomerView() {
    // Hide the product grid
    productGrid.style.display = "none";
    
    // Show the customer section
    customerSection.style.display = "block";
    
    // Update sidebar active state
    updateSidebarActive(2);
    
    // Refresh customer table display
    renderCustomerTable();
}

// Update which sidebar menu item is highlighted
function updateSidebarActive(index) {
    // Get all sidebar menu items
    let menuItems = document.querySelectorAll('.sidebar nav li');
    
    // Loop through each menu item
    for (let i = 0; i < menuItems.length; i++) {
        // Remove active class from all items
        menuItems[i].classList.remove('active');
    }
    
    // Add active class to the selected item
    if (menuItems[index]) {
        menuItems[index].classList.add('active');
    }
}

// ===========================================
// CUSTOMER MANAGEMENT FUNCTIONS (CRUD)
// ===========================================

// CREATE: Save a new customer to the customers array
function saveCustomer() {
    // Get the values from input fields
    let customerName = customerNameInput.value;
    let customerEmail = customerEmailInput.value;
    
    // Check if inputs are empty
    if (customerName === "" || customerEmail === "") {
        alert("Please enter both name and email!");
        return;
    }
    
    // Generate new customer ID (format: C001, C002, C003...)
    let newId = "C" + String(nextCustomerId).padStart(3, "0");
    nextCustomerId = nextCustomerId + 1;
    
    // Create new customer object
    let newCustomer = {
        id: newId,
        name: customerName,
        email: customerEmail
    };
    
    // Add customer to customers array
    customers.push(newCustomer);
    
    // Clear the input fields
    customerNameInput.value = "";
    customerEmailInput.value = "";
    
    // Update the customer table display
    renderCustomerTable();
    
    // Show success message
    alert("Customer saved successfully! ID: " + newId);
}

// READ: Display all customers in the table
function renderCustomerTable() {
    // Clear the current table content
    customerTableBody.innerHTML = "";
    
    // Loop through each customer in the customers array
    for (let i = 0; i < customers.length; i++) {
        let customer = customers[i];
        
        // Create a new table row
        let row = document.createElement('tr');
        
        // Set the HTML content for this row
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
        `;
        
        // Add the row to the table body
        customerTableBody.appendChild(row);
    }
}

// ===========================================
//  discountInput.value = "";
    
    // Show success message
    alert("Order placed successfully! Order #" + newOrder.id);
}

// ===========================================
// START THE APPLICATION
// ===========================================

// Run initialization when page loads
initializeApp();