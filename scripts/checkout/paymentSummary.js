import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formateCurrency } from "../utils/money.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";
import { addOrder } from '../../data/orders.js';
// ...existing code...

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let cartQuantity = 0;

  // Calculate totals
  cart.forEach((cartItem, index) => {
    if (!cartItem.productId) {
      console.warn(`Cart item at index ${index} has undefined productId:`, cartItem);
      return; // Skip this cart item if productId is undefined
    }

    const product = getProduct(cartItem.productId);
    if (!product) {
      console.warn(`Product not found for productId: ${cartItem.productId} in cart item at index ${index}:`, cartItem);
      return; // Skip this cart item if product is not found
    }
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    if (!deliveryOption) {
      console.warn(`Delivery option not found for deliveryOptionId: ${cartItem.deliveryOptionId} in cart item at index ${index}:`, cartItem);
      return; // Skip if delivery option is not found
    }
    shippingPriceCents += deliveryOption.priceCents;
    cartQuantity += cartItem.quantity;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  // Generate HTML for payment summary
  const paymentSummaryHtml = `
    <div class="payment-summary-title">
      Order Summary
    </div>
    <div class="payment-summary-row">
      <div>Items (${cartQuantity}):</div>
      <div class="payment-summary-money">$${formateCurrency(productPriceCents)}</div>
    </div>
    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formateCurrency(shippingPriceCents)}</div>
    </div>
    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formateCurrency(totalBeforeTaxCents)}</div>
    </div>
    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formateCurrency(taxCents)}</div>
    </div>
    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formateCurrency(totalCents)}</div>
    </div>
    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;

  // Update the payment summary HTML
  const paymentSummaryElement = document.querySelector('.js-payment-summary');
  paymentSummaryElement.innerHTML = paymentSummaryHtml;

  // Render checkout header
  renderCheckoutHeader();

  // Remove any existing event listeners to prevent duplicates
  const placeOrderButton = document.querySelector('.js-place-order');
  const newButton = placeOrderButton.cloneNode(true);
  placeOrderButton.parentNode.replaceChild(newButton, placeOrderButton);

  // Add event listener to the new button
  newButton.addEventListener('click', async () => {
    try {
      // Filter out invalid cart items before sending to the server
      const validCart = cart.filter(cartItem => cartItem.productId && getProduct(cartItem.productId) && getDeliveryOption(cartItem.deliveryOptionId));
      if (validCart.length === 0) {
        alert('Your cart is empty or contains invalid items. Please review your cart.');
        return;
      }

      const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: validCart,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const data = await response.json();
      addOrder(data);
      window.location.href = 'orders.html'; // Redirect only on success
    } catch (error) {
      console.error('Unexpected Error: ', error);
      alert('Failed to place order. Please try again later.');
    }
  });
}