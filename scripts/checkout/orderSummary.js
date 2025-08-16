// Import necessary data and functions
import { cart, removeCart, calculateCartQuantity, updateQuantity, updateDeliveryOption } from "../../data/cart.js"; // Cart data and functions
import { products, getProduct } from "../../data/products.js"; // Products data
import { formateCurrency } from "../utils/money.js"; // Currency formatting utility
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js"; // Date manipulation library
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js"; // Delivery options data
import { renderPaymentSummary } from "./paymentSummary.js"; // Payment summary rendering function

import { renderCheckoutHeader } from "../checkout/checkoutHeader.js";

export function renderOrderSummary() {
  let cartSummaryHTML = ''; // Store HTML for cart summary

  // Loop through cart items to build summary HTML
  cart.forEach((cartItem) => {
    const productId = cartItem.productId; // Get product ID
    const matchingProduct = getProduct(productId); // Find matching product
    if (!matchingProduct) return; // Skip if no product found

    const deliveryOptionId = cartItem.deliveryOptionId; // Get delivery option ID
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    if (!deliveryOption) return; // Skip if no delivery option found

    const today = dayjs(); // Current date
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days'); // Calculate delivery date
    const formattedDate = deliveryDate.format('dddd, MMMM D'); // Format date

    // Add cart item HTML to summary
    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date js-delivery-date">
          Delivery date: ${formattedDate}
        </div>
        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">
          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">$${formateCurrency(matchingProduct.priceCents)}</div>
            <div class="product-quantity">
              <span>Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span></span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input type="number" class="quantity-input js-quantity-input-${matchingProduct.id}" min="1" value="${cartItem.quantity}">
              <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>
          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${delivryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  // Generate HTML for delivery options
  function delivryOptionsHTML(matchingProduct, cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs(); // Current date
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days'); // Calculate delivery date
      const formattedDate = deliveryDate.format('dddd, MMMM D'); // Format date
      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formateCurrency(deliveryOption.priceCents)} -`; // Format price
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId; // Check if option is selected

      // Add delivery option HTML
      html += `
        <div class="delivery-option js-delivery-option"
             data-product-id="${matchingProduct.id}"
             data-delivery-option-id="${deliveryOption.id}">
          <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">${formattedDate}</div>
            <div class="delivery-option-price">${priceString} Shipping</div>
          </div>
        </div>`;
    });
    return html;
  }

  // Inject cart summary HTML into the page
  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;


  // Add event listeners for delete links
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId; // Get product ID
      removeCart(productId); // Remove item from cart
      renderCheckoutHeader(); // Re-render header
      renderOrderSummary(); // Re-render summary
      renderPaymentSummary(); // Re-render payment summary
    });
  });

  // Add event listeners for update links
  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId; // Get product ID
      const container = document.querySelector(`.js-cart-item-container-${productId}`); // Get item container
      container.classList.add('is-editing-quantity'); // Show quantity input
    });
  });

  // Add event listeners for save links
  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId; // Get product ID
      const container = document.querySelector(`.js-cart-item-container-${productId}`); // Get item container
      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`); // Get quantity input
      let newQuantity = Number(quantityInput.value); // Convert input to number

      // Validate quantity
      if (isNaN(newQuantity) || newQuantity < 1 || newQuantity > 1000) {
        alert('Please enter a valid quantity between 1 and 1000');
        return;
      }

      updateQuantity(productId, newQuantity); // Update cart quantity
      container.classList.remove('is-editing-quantity'); // Hide quantity input
      const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`); // Get quantity label
      quantityLabel.innerHTML = newQuantity; // Update displayed quantity
      updateCartQuantityDisplay(); // Update quantity display
    });
  });

  // Update cart quantity display on page load
  updateCartQuantityDisplay();

  // Add event listeners for delivery options
  document.querySelectorAll('.js-delivery-option').forEach((option) => {
    option.addEventListener('click', () => {
      const { productId, deliveryOptionId } = option.dataset; // Get product and delivery option IDs
      updateDeliveryOption(productId, deliveryOptionId); // Update delivery option
      renderOrderSummary(); // Re-render summary
      renderPaymentSummary(); // Re-render payment summary
    });
  });
}