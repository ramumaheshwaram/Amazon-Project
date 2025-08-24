class Cart {

  cartItems;
  localStorageKey;

  constructor(localStorageKey) {

    this.localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey)) || [
      {
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', // Hardcoded product ID
        quantity: 2,// Default quantity
        deliveryOptionId: '1' // Default delivery option ID
      },
      {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d', // Hardcoded product ID
        quantity: 1, // Default quantity
        deliveryOptionId: '2' // Default delivery option ID
      }
    ];
  }

  saveToStorage() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems)); // Convert cart to JSON and save
  }

  addToCart(productId, quantity) {
    let matchingItem;
    // Check if the product is already in the cart
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    // If product exists, increase its quantity; otherwise, add new item to cart
    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productId,
        quantity,
        deliveryOptionId: '1' // Default delivery option ID
      });
    }
    this.saveToStorage(); // Save updated cart to localStorage
  }

  removeCart(productId) {
    // Filter out the item with the matching product ID
    this.cartItems = this.cartItems.filter((cartItem) => cartItem.productId !== productId);
    this.saveToStorage(); // Save updated cart to localStorage
  }

  calculateCartQuantity() {
    return this.cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0); // Sum quantities of all items
  }

  updateQuantity(productId, newQuantity) {
    let matchingItem;
    // Find the item in the cart
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
    // If item exists, update its quantity
    if (matchingItem) {
      matchingItem.quantity = newQuantity;
      this.saveToStorage(); // Save updated cart to localStorage
    }
  }

  updateDeliveryOption(productId, deliveryOptionId) {

    let matchingItem;
    // Check if the product is already in the cart
    this.cart.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
    if (matchingItem) {
      matchingItem.deliveryOptionId = deliveryOptionId; // Update delivery option ID
      this.saveToStorage(); // Save updated cart to localStorage
    }

  }

}

const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');




console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Cart);

