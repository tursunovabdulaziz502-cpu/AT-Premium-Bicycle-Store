let cart = [];

const cartToggle = document.getElementById('cartToggle');
const cartModal = document.getElementById('cartModal');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
const cartItemsContainer = document.getElementById('cartItems');
const totalPriceElement = document.getElementById('totalPrice');
const cartCountElement = document.getElementById('cartCount');

function openCart() {
    cartModal.classList.add('open');
    cartOverlay.classList.add('active');
}

function closeCartModal() {
    cartModal.classList.remove('open');
    cartOverlay.classList.remove('active');
}

cartToggle.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartModal);
cartOverlay.addEventListener('click', closeCartModal);

addToCartBtns.forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));

        addToCart(id, name, price);
        openCart();
    });
});

function addToCart(id, name, price) {
    const existingIndex = cart.findIndex(item => item.id === id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCartUI();
}

function changeQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartUI();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let totalCount = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Savat hozircha bo\'sh.</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            totalCount += item.quantity;

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div>
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">&times;</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    totalPriceElement.innerText = total.toLocaleString();
    cartCountElement.innerText = totalCount;
}

function checkout() {
    if (cart.length === 0) {
        alert("Savatingiz bo'sh!");
        return;
    }
    alert("Buyurtmangiz qabul qilindi! Rahmat.");
    cart = [];
    updateCartUI();
    closeCartModal();
}