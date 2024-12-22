let cv = document.getElementById('cartvalue');
cv.innerHTML = localStorage.getItem('cartCount') || 0;

let grid = document.getElementById('grid');
let allItems = [];
fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then((data) => {
    allItems = data;
    display(allItems);
  })
  .catch(() => console.error('Error'));
function display(items) {
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
      <center><img src=${img} style='height:250px;width:300px;margin-bottom:5px;'>
      <h5 style='margin-bottom:5px;'>${title}</h5>
      <p style='margin-bottom:5px;'>${des}</p>
      <hr style='margin-bottom:5px;'>
      <p style='margin-bottom:5px;'>$${price}</p>
      <hr>
      <button style='background-color:black;color:white;margin:10px 5px 5px;border-radius:3px;width:3rem;padding:3px;'>Details</button>
      <button style='background-color:black;color:white;margin:10px 5px 5px;border-radius:3px;width:5rem;padding:3px;' onclick="atc(${objId})">Add to Cart</button></center>
    `;
    grid.appendChild(ctn);
  });
}
function filtering(category) {

  let filteredItems = category === 'all' ? allItems : allItems.filter(obj => obj.category === category);
  display(filteredItems);
}

let ids = JSON.parse(localStorage.getItem('cartIds')) || [];
function atc(id) {
  if (!ids.includes(id)) {
    cv.innerHTML++;
    ids.push(id);

    localStorage.setItem('cartIds', JSON.stringify(ids));
    localStorage.setItem('cartCount', ids.length);
  }

}

function cartCounting() {
  cv.innerHTML = localStorage.getItem('cartCount') || 0;
}

