// Initialize cart by retrieving it from localStorage, or use default cart if none exists
export let cart = JSON.parse(localStorage.getItem('cart')) || [
  {
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', // Hardcoded product ID
    quantity: 2 // Default quantity
  },
  {
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d', // Hardcoded product ID
    quantity: 1 // Default quantity
  }
];

// Function to save the cart to localStorage
function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart)); // Convert cart to JSON and save
}

// Function to add a product to the cart
export function addToCart(productId, quantity) {
  let matchingItem;
  // Check if the product is already in the cart
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  // If product exists, increase its quantity; otherwise, add new item to cart
  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity
    });
  }
  saveToStorage(); // Save updated cart to localStorage
}

// Function to remove a product from the cart
export function removeCart(productId) {
  // Filter out the item with the matching product ID
  cart = cart.filter((cartItem) => cartItem.productId !== productId);
  saveToStorage(); // Save updated cart to localStorage
}

// Function to calculate the total quantity of items in the cart
export function calculateCartQuantity() {
  return cart.reduce((total, cartItem) => total + cartItem.quantity, 0); // Sum quantities of all items
}

// Function to update the quantity of a product in the cart
export function updateQuantity(productId, newQuantity) {
  let matchingItem;
  // Find the item in the cart
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  // If item exists, update its quantity
  if (matchingItem) {
    matchingItem.quantity = newQuantity;
    saveToStorage(); // Save updated cart to localStorage
  }
}