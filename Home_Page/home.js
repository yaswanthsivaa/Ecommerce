let cv = document.getElementById('cartValue');
let allItems = [];
function load() {
  cv.innerHTML = localStorage.getItem('cartCount') || 0;
}
window.onload = load;

fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then(data => {
    allItems = data;
    localStorage.setItem('data', JSON.stringify(allItems));
    display(allItems); 
  })
  .catch(() => console.error('Error fetching data'));

function display(items) {
  let grid = document.getElementById('grid');
  grid.innerHTML = '';
  items.forEach(obj => {
    let ctn = document.createElement('div');
    ctn.setAttribute('style', 'border:1px solid lightgray;margin:10px;padding:10px;');
    
    let img = obj.image;
    let title = obj.title.length > 12 ? obj.title.slice(0, 12) + '...' : obj.title;
    let des = obj.description.length > 100 ? obj.description.slice(0, 100) + '...' : obj.description;
    let price = obj.price;
    let objId = obj.id;
    
    ctn.innerHTML = `
      <img src=${img} style='height:250px;width:300px;margin-bottom:5px;'>
      <h5 style='margin-bottom:5px;'>${title}</h5>
      <p style='margin-bottom:5px;'>${des}</p>
      <hr style='margin-bottom:5px;'>
      <p style='margin-bottom:5px;'>$${price}</p>
      <hr>
      <button style='background-color:black;color:white;margin:10px 5px 5px;border-radius:3px;width:3rem;padding:3px;'>Details</button>
      <button style='background-color:black;color:white;margin:10px 5px 5px;border-radius:3px;width:5rem;padding:3px;' onclick="addToCart(${objId})">Add to Cart</button>
    `;
    grid.appendChild(ctn);
  });
}

function addToCart(itemId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let itemToAdd = allItems.find(item => item.id === itemId);

  if (!itemToAdd) {
    console.error('Product not found with id:', itemId);
    return;
  }

  let existingItemIndex = cart.findIndex(item => item.id === itemId);

  if (existingItemIndex !== -1) {
    console.log('Item already in cart');
  } else {
    cart.push({ ...itemToAdd, quantity: 1 });
    console.log(`Added ${itemToAdd.title} to cart`);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount(cart);

  document.getElementById('cartValue').innerHTML = cart.reduce((total, item) => total + item.quantity, 0);
}
