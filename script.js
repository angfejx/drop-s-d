// Manejo simple de carrito usando localStorage
const CART_KEY = 'cart_items_v1';

function getCart(){
  try{
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  }catch(e){
    return [];
  }
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function updateCartCount(){
  const cart = getCart();
  const total = cart.reduce((s,i)=>s + (i.quantity || 1), 0);
  const el = document.getElementById('cart-count');
  if(el) el.textContent = total;
}

// Añadir un ítem al carrito (id, name, price, image)
function addToCart(item){
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if(existing){
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    item.quantity = 1;
    cart.push(item);
  }
  saveCart(cart);
  updateCartCount();
  alert(item.name + ' agregado al carrito');
}

// Mostrar carrito en carrito.html
function renderCartPage(){
  const container = document.getElementById('cart-contents');
  if(!container) return;
  const cart = getCart();
  if(cart.length === 0){
    container.innerHTML = '<p>Tu carrito está vacío.</p>';
    document.getElementById('cart-actions').style.display = 'none';
    return;
  }
  let html = '';
  let totalPrice = 0;
  cart.forEach(item => {
    const line = (item.price || 0) * (item.quantity || 1);
    totalPrice += line;
    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div style="flex:1">
          <div><strong>${item.name}</strong></div>
          <div class="small-muted">${item.quantity} x $${item.price} MXN</div>
        </div>
        <div><strong>$${line} MXN</strong></div>
        <div><button class="remove-item" data-id="${item.id}">Quitar</button></div>
      </div>
    `;
  });
  html += `<div style="margin-top:12px"><strong>Total: $${totalPrice} MXN</strong></div>`;
  container.innerHTML = html;

  // listeners para quitar item
  document.querySelectorAll('.remove-item').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const id = btn.getAttribute('data-id');
      let c = getCart().filter(it => String(it.id) !== String(id));
      saveCart(c);
      renderCartPage();
      updateCartCount();
    });
  });
}

// Limpiar carrito
function clearCart(){
  saveCart([]);
  renderCartPage();
  updateCartCount();
}

// Al cargar el DOM
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();
  // botones "Agregar al carrito" (en product pages)
  document.querySelectorAll('.add-to-cart').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = Number(btn.getAttribute('data-price') || 0);
      const image = btn.getAttribute('data-image') || '';
      addToCart({ id, name, price, image });
    });
  });

  // Si estamos en la página de carrito
  if(document.getElementById('cart-contents')){
    renderCartPage();
    const clearBtn = document.getElementById('clear-cart');
    if(clearBtn) clearBtn.addEventListener('click', ()=> {
      if(confirm('¿Vaciar carrito?')) clearCart();
    });
  }
});
