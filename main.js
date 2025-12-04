document.addEventListener("DOMContentLoaded", function() {
    // Load header
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
        });

    // Load footer
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer").innerHTML = data;
        });
    
    // Initialize cart from localStorage if possible
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartUI();
});


function toggleCart() {
    document.getElementById('cart-overlay').classList.toggle('open');
    document.getElementById('cart-sidebar').classList.toggle('open');
}

let cart = []; // Array to hold cart items: { name, price, image, quantity }

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }

    updateCartUI();
    showToast(`${name} added to cart!`);
    if (!document.getElementById('cart-sidebar').classList.contains('open')) {
      toggleCart();
    }
}

function changeQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            // This will call updateCartUI internally
            removeFromCart(name, false); 
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const emptyMsg = document.querySelector('.empty-cart-msg');

    // Update cart count bubble
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Save to local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is currently empty.</p>';
        cartTotal.textContent = `₹0.00`;
    } else {
        cartItemsContainer.innerHTML = ''; // Clear previous items

        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            // Note the use of escaped quotes for the function calls inside the template literal
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <span class="cart-item-size">Size: 100g</span> <!-- Example Size -->
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="changeQuantity(\'${item.name}\', -1)">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="changeQuantity(\'${item.name}\', 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-price-section">
                    <span class="price">₹${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-item" onclick="removeFromCart(\'${item.name}\')"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        cartTotal.textContent = `₹${total.toFixed(2)}`;
    }
}

function removeFromCart(name, show=true) {
    cart = cart.filter(item => item.name !== name);
    updateCartUI();
    if(show){
      showToast(`${name} removed from cart.`, 'remove');
    }
}

function showToast(message, type = 'add') {
    const toast = document.getElementById('toast');
    toast.innerHTML = ''; // Clear previous content
    
    if (type === 'remove') {
        toast.style.background = '#c0392b'; // A reddish color for removal
        toast.innerHTML = `<i class="fas fa-trash"></i> ${message}`;
    } else {
        toast.style.background = '#1a1a1a'; // Default dark color
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    }

    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2500);
}

// --- AI Chatbot Functions ---
function toggleChat() {
    const chatWindow = document.getElementById('ai-chat-window');
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
}

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (message === '') return;

    // Display user message
    displayMessage(message, 'user');
    userInput.value = '';

    // Show typing indicator
    document.getElementById('typing-indicator').style.display = 'block';

    // Simulate bot response
    setTimeout(() => {
        const botResponse = getBotResponse(message);
        displayMessage(botResponse, 'bot');
        // Hide typing indicator
        document.getElementById('typing-indicator').style.display = 'none';
    }, 1500);
}

function displayMessage(message, sender) {
    const chatBody = document.getElementById('chat-body');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender}`;
    messageDiv.textContent = message;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll to bottom
}

function handleEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Simple Keyword-based AI logic
function getBotResponse(message) {
    const lowerCaseMessage = message.toLowerCase();
    
    if (lowerCaseMessage.includes("neem")) {
        return "Neem is excellent for skin purification and blood cleansing. It's a powerful anti-microbial herb.";
    } else if (lowerCaseMessage.includes("ashwagandha")) {
        return "Ashwagandha is an adaptogen. It helps the body manage stress, boosts brain function, and increases strength. It's great for Vata imbalance.";
    } else if (lowerCaseMessage.includes("moringa")) {
        return "Moringa, the 'Miracle Tree', is a superfood packed with vitamins, minerals, and antioxidants. It's perfect for boosting energy and overall vitality.";
    } else if (lowerCaseMessage.includes("giloy") || lowerCaseMessage.includes("guduchi")) {
        return "Giloy (Guduchi) is a supreme immunity booster. Known as 'Amrita', it helps fight off infections and removes toxins from the body.";
    } else if (lowerCaseMessage.includes("skin")) {
        return "For skin issues, I highly recommend our Pure Neem Powder. Its anti-microbial properties work wonders.";
    } else if (lowerCaseMessage.includes("stress") || lowerCaseMessage.includes("anxiety")) {
        return "To combat stress and anxiety, Ashwagandha is the ideal choice. It helps calm the nervous system and build resilience.";
    } else if (lowerCaseMessage.includes("energy") || lowerCaseMessage.includes("tired")) {
        return "If you're feeling low on energy, our Organic Moringa Powder is a fantastic natural revitalizer.";
    } else if (lowerCaseMessage.includes("immunity") || lowerCaseMessage.includes("sick")) {
        return "To boost your immunity, Giloy (Guduchi) is the herb you need. It is renowned for its ability to protect the body.";
    } else {
        return "I am an AI specialized in our herbal products. For general health advice, please consult with one of our doctors. Which health concern can I help you with today? (e.g., skin, stress, energy, immunity)";
    }
}
