// Importing necessary data and functions from other modules
import { cart, addToCart, calculateCartQuantity } from "../data/cart.js"; // Imports cart array and functions to manage cart
import { products } from "../data/products.js"; // Imports the products array containing product details
import { formateCurrency } from "./utils/money.js"; // Imports utility function to format price in dollars

// Initialize an empty string to store HTML for product cards
let productsHTML = '';

// Loop through each product in the products array to generate HTML for product cards
products.forEach((product) => {
  // Append HTML for each product to productsHTML string
  productsHTML += `
    <div class="product-container"> <!-- Container for individual product -->
      <div class="product-image-container">
        <img class="product-image" src="${product.image}"> <!-- Product image -->
      </div>
      <div class="product-name limit-text-to-2-lines">
        ${product.name} <!-- Product name, limited to 2 lines of text -->
      </div>
      <div class="product-rating-container">
        <!-- Display star rating image based on product rating (stars multiplied by 10 for image file name) -->
        <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count} <!-- Number of reviews/ratings -->
        </div>
      </div>
      <div class="product-price">
        $${formateCurrency(product.priceCents)} <!-- Formatted price in dollars -->
      </div>
      <div class="product-quantity-container">
        <!-- Dropdown to select quantity (1 to 10) -->
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
      <div class="product-spacer"></div> <!-- Spacer for layout purposes -->
      <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png"> <!-- Checkmark icon for "Added" message -->
        Added <!-- Message shown when item is added to cart -->
      </div>
      <!-- Button to add product to cart, with product ID stored in data attribute -->
      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});

// Inject the generated product HTML into the product grid element on the page
document.querySelector('.js-products-grid').innerHTML = productsHTML;

// Function to update the cart quantity display on the page
function updateCartQuantityDisplay() {
  const cartQuantity = calculateCartQuantity(); // Calculate total items in cart
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity; // Update cart quantity display
}

// Variable to store timeout ID for clearing "Added" message
let addedMessageTimeoutId;

// Add event listeners to all "Add to Cart" buttons
document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const { productId } = button.dataset; // Get product ID from button's data attribute
    const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`); // Get quantity selector for this product
    const quantity = Number(quantitySelector.value); // Convert selected quantity to number

    addToCart(productId, quantity); // Add product and quantity to cart
    updateCartQuantityDisplay(); // Update cart quantity display

    const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`); // Get "Added" message element
    addedMessage.classList.add('added-message'); // Show "Added" message by adding CSS class

    // Clear any existing timeout to prevent multiple timeouts from stacking
    if (addedMessageTimeoutId) {
      clearTimeout(addedMessageTimeoutId);
    }
    // Set timeout to hide "Added" message after 2 seconds
    addedMessageTimeoutId = setTimeout(() => {
      addedMessage.classList.remove('added-message'); // Hide "Added" message
    }, 2000);
  });
});

// Initial call to update cart quantity display when page loads
updateCartQuantityDisplay();