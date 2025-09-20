import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js"; // Import the getDelivery function
import { formateCurrency } from "../utils/money.js";
import { renderCheckoutHeader } from "./checkoutHeader.js"; // Import the renderCheckoutHeader function
import { addOrder } from '../../data/Orders.js'


export function renderPaymentSummary() {
  let productPriceCents = 0; // Initialize total price variable
  let shippingPriceCents = 0; // Initialize shipping price variable
  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId); // Ensure product data is fetched
    productPriceCents += product.priceCents * cartItem.quantity; // Calculate total price for the product

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId); // Fetch delivery option
    shippingPriceCents += deliveryOption.priceCents; // Add delivery price to total

  });
  const totalBeforeTaxCents = productPriceCents + shippingPriceCents; // Calculate total before tax
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents; // Calculate total price including tax

  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity; // Calculate total quantity of items in the cart
  });

  const paymentSummaryHtml = `
  
  <div class="payment-summary-title">
          Order Summary
        </div>

        <div class="payment-summary-row">
          <div >Items (${cartQuantity}):</div>
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

        <button class="place-order-button button-primary js-place-order ">
          Place your order
        </button>
  `;
  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHtml;
  renderCheckoutHeader(); // Call function to render checkout header when the script loads
  // updateCartQuantityDisplay(); // Update cart quantity display

  document.querySelector('.js-place-order')
  addEventListener('click', async () => {
    try {
      const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: cart,
        })
      });
      const data = await response.json();
      addOrder(data);
    } catch (error) {
      console.log('unexpected Error . Try again later');

    }
    window.location.href = 'orders.html';
  });
}

