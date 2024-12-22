let allData = [];
fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => {
        allData = data;
        displayCards(allData);
    })
    .catch(error => console.error('Error fetching products:', error));
function displayCards(cards) {
    let div = document.getElementById('grid');
    div.innerHTML = '';
    cards.forEach(card => {
        div.innerHTML += `
            <center><div id='cardDiv' style='border:1px solid gray;border-radius:8px'>
                <img src='${card.image}' width='200px' height='250'>
                <p>${card.title.slice(0, 11)}${card.title.length > 11 ? '...' : ''}</p>
                <p>${card.description.slice(0, 100)}${card.description.length > 100 ? '...' : ''}</p>
                <hr>
                <p>$${card.price}</p>
                <hr>
                <button style='background-color:black;color:white;border-radius:5px;padding:5px 10px'>Details</button>
                <button onclick="addToCart(${card.id}, '${card.title}', ${card.price}, '${card.image}')" style="background-color:black;color:white;border-radius:5px;padding:5px 10px">Add to Cart</button>
            </div></center>`;
    })
};

function addToCart(id, title, price, image) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.id === id);
    if (!product) {
        cart.push({ id, title, price, image, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQuantity = cart.length
    document.getElementById('cartValue').textContent = totalQuantity;
}

function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const checkout = document.getElementById('checkout');
    const emptyCartDiv = document.getElementById('cart');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsContainer.innerHTML = ""; 

    if (cart.length === 0) {
        emptyCartDiv.style.display = 'block'; 
        cartItemsContainer.style.display = 'none'; 
        checkout.style.display = 'none'; 
    } else {
        emptyCartDiv.style.display = 'none'; 
        checkout.style.display = 'block'; 
        let h1 = document.createElement('h1');
        let txt = document.createTextNode('Item List');
        h1.appendChild(txt)
        h1.style.borderBottom='1px solid gray';
        h1.style.backgroundColor='whitesmoke';
        document.getElementById('cart-items').appendChild(h1)
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <p>${item.title.slice(0, 20)}${item.title.length > 20 ? '' : ''}</p>
                <div>
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>`;
            cartItemsContainer.appendChild(cartItem);
        });

        
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shippingCost = 30;
        const finalTotalPrice = totalPrice + shippingCost;

        
        checkout.innerHTML = `
            <p style='background-color:whitesmoke;'><strong>Order Summary</strong></p>
            <p style='border-top:1px solid gray;margin-top:20px;padding-top:15px;'>Products (${cart.reduce((acc, item) => acc + item.quantity, 0)})</p>
            <p>$${totalPrice.toFixed(2)}</p>
            <p>Shipping: $${shippingCost.toFixed(2)}</p>
            <p><strong>Total Price:</strong> $${finalTotalPrice.toFixed(2)}</p>
            <button class="btn btn-dark w-100">Go to Checkout</button>`;
    }
}


function changeQuantity(id, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === id);

    if (index >= 0) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1); 
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart(); 
        updateCartCount(); 
    }
}


document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(); 
    if (document.getElementById('cart-items')) loadCart(); 
});
