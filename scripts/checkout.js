// Importing necessary data and functions from other modules
import { cart, removeCart, calculateCartQuantity, updateQuantity, updateDeliveryOption } from "../data/cart.js"; // Imports cart and cart-related functions
import { products } from "../data/products.js"; // Imports products array
import { formateCurrency } from "./utils/money.js"; // Imports utility function to format price
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js"; // Imports dayjs for date manipulation

import { deliveryOptons } from "../data/deliveryOptions.js"; // Imports delivery options data


function renderOrderSummary() {

  // Initialize an empty string to store HTML for cart summary
  let cartSummaryHTML = '';

  // Loop through each item in the cart to generate HTML for cart summary
  cart.forEach((cartItem) => {
    const productId = cartItem.productId; // Get product ID from cart item

    let matchingProduct;
    // Find the product in the products array that matches the cart item's product ID
    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    });

    // Skip if no matching product is found
    if (!matchingProduct) return;

    const deliveryOptionId = cartItem.deliveryOptionId; // Get delivery option ID from cart item

    let deliveryOption;
    deliveryOptons.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option; // Find the delivery option that matches the cart item's delivery option ID
      }
    });
    // Skip if no deliveryOption is found
    if (!deliveryOption) return;

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days'); // Calculate the date one week from today
    const formattedDate = deliveryDate.format('dddd, MMMM D'); // Format the date

    // Append HTML for each cart item to cartSummaryHTML
    cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container-${matchingProduct.id}"> <!-- Container for cart item -->
              <div class="delivery-date js-delivery-date">
                Delivery date: ${formattedDate} <!-- Hardcoded delivery date -->
              </div>
              <div class="cart-item-details-grid">
                <img class="product-image" src="${matchingProduct.image}"> <!-- Product image -->
                <div class="cart-item-details">
                  <div class="product-name">
                    ${matchingProduct.name} <!-- Product name -->
                  </div>
                  <div class="product-price">
                    $${formateCurrency(matchingProduct.priceCents)} <!-- Formatted price -->
                  </div>
                  <div class="product-quantity">
                    <!-- Display current quantity -->
                    <span>
                      Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                    </span>
                    <!-- Link to trigger quantity update mode -->
                    <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                      Update
                    </span>
                    <!-- Input field for updating quantity, initially hidden -->
                    <input type="number" class="quantity-input js-quantity-input-${matchingProduct.id}" min="1" value="${cartItem.quantity}">
                    <!-- Link to save updated quantity -->
                    <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">
                      Save
                    </span>
                    <!-- Link to delete item from cart -->
                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                      Delete
                    </span>
                  </div>
                </div>
                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  ${delivryOptionsHTML(matchingProduct, cartItem)} <!-- Call function to generate delivery options HTML -->
                </div>
              </div>
            </div>
          `;
  });

  function delivryOptionsHTML(matchingProduct, cartItem) {

    let html = '';
    // Loop through each delivery option to generate HTML for delivery options
    deliveryOptons.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days'); // Calculate the date one week from today
      const formattedDate = deliveryDate.format('dddd, MMMM D'); // Format the date

      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formateCurrency(deliveryOption.priceCents)} -`; // Format price or show "FREE Shipping"

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId; // Check if this option is selected in the cart

      // Append HTML for each delivery option to HTML
      html += `
            <div class="delivery-option js-delivery-option"
                    data-product-id="${matchingProduct.id}"
                    data-delivery-option-id="${deliveryOption.id}">
                    <!-- Data attributes for product and delivery option IDs -->
                    <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
                    <div>
                      <div class="delivery-option-date">
                        ${formattedDate} <!-- Display formatted delivery date -->
                      </div>
                      <div class="delivery-option-price">
                      ${priceString} Shipping <!-- Display formatted price or "FREE Shipping" -->
                      </div>
                    </div>
                  </div>`
    });
    return html; // Return the generated HTML for delivery options
  }

  // Inject the generated cart summary HTML into the order summary element on the page
  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  // Function to update the cart quantity display on the page
  function updateCartQuantityDisplay() {
    const cartQuantity = calculateCartQuantity(); // Calculate total items in cart
    // Update the "Return to Home" link with cart quantity
    document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;

  }

  // Add event listeners to all "Delete" links
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId; // Get product ID from link's data attribute
      removeCart(productId); // Remove item from cart
      const container = document.querySelector(`.js-cart-item-container-${productId}`); // Get cart item container
      container.remove(); // Remove item from the page
      updateCartQuantityDisplay(); // Update cart quantity display
    });
  });

  // Add event listeners to all "Update" links
  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId; // Get product ID from link's data attribute
      const container = document.querySelector(`.js-cart-item-container-${productId}`); // Get cart item container
      container.classList.add('is-editing-quantity'); // Show quantity input field by adding CSS class
    });
  });

  // Add event listeners to all "Save" links
  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId; // Get product ID from link's data attribute
      const container = document.querySelector(`.js-cart-item-container-${productId}`); // Get cart item container
      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`); // Get quantity input field
      let newQuantity = Number(quantityInput.value); // Convert input value to number

      // Validate quantity
      if (newQuantity < 1) {
        alert('Quantity must be at least 1'); // Show alert if quantity is invalid
        return;
      }

      updateQuantity(productId, newQuantity); // Update quantity in cart
      container.classList.remove('is-editing-quantity'); // Hide quantity input field
      const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`); // Get quantity label
      quantityLabel.innerHTML = newQuantity; // Update displayed quantity
      updateCartQuantityDisplay(); // Update cart quantity display
    });
  });

  // Initial call to update cart quantity display when page loads
  updateCartQuantityDisplay();

  document.querySelectorAll('.js-delivery-option')
    .forEach((option) => {
      option.addEventListener('click', () => {
        // shorthend propertie because we are using data attributes
        // to store productId and deliveryOptionId
        // so we can access them directly from the clicked option
        const { productId, deliveryOptionId } = option.dataset; // Destructure data attributes from the clicked delivery option
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary(); // Re-render order summary to reflect changes //recursion
      });
    });
}

renderOrderSummary(); // Call function to render order summary when the script loads