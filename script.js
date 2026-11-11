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
    const isEmpty = cart.length === 0;

    const alertBox = document.createElement("div");

    alertBox.innerHTML = `
        <div style="font-size:45px; margin-bottom:15px;">
            ${isEmpty ? "⚠️" : "✓"}
        </div>

        <h2 style="margin:0 0 10px; font-size:22px;">
            ${isEmpty ? "Savat bo'sh!" : "Buyurtma qabul qilindi!"}
        </h2>

        <p style="color:#94a3b8; margin-bottom:25px;">
            ${isEmpty ? "Avval mahsulot qo'shing." : "Xaridingiz uchun rahmat!"}
        </p>

        <button id="alertOk">Tushunarli</button>
    `;

    alertBox.style.cssText = `
        position:fixed;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        width:320px;
        padding:30px;
        box-sizing:border-box;
        text-align:center;
        color:white;
        background:rgba(15,23,42,0.95);
        border:1px solid rgba(255,255,255,0.12);
        border-radius:22px;
        box-shadow:0 20px 60px #0008;
        backdrop-filter:blur(20px);
        font-family:Arial;
        z-index:10001;
        animation:alertShow .3s ease;
    `;

    const overlay = document.createElement("div");
    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,0.65);
        backdrop-filter:blur(5px);
        z-index:10000;
    `;

    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes alertShow {
            from { opacity:0; transform:translate(-50%,-40%); }
            to { opacity:1; transform:translate(-50%,-50%); }
        }

        #alertOk {
            width:100%;
            padding:12px;
            border:0;
            border-radius:10px;
            background:#3b82f6;
            color:white;
            font-size:15px;
            cursor:pointer;
        }

        #alertOk:hover {
            background:#2563eb;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(overlay);
    document.body.appendChild(alertBox);

    function closeAlert() {
        alertBox.remove();
        overlay.remove();
        style.remove();
    }

    document.getElementById("alertOk").onclick = closeAlert;
    overlay.onclick = closeAlert;

    if (!isEmpty) {
        cart = [];
        updateCartUI();
        closeCartModal();
    }
}