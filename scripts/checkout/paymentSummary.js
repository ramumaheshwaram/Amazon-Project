import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js"; // Import the getDelivery function
import { formateCurrency } from "../utils/money.js";


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


  const paymentSummaryHtml = `
  
  <div class="payment-summary-title">
          Order Summary
        </div>

        <div class="payment-summary-row">
          <div>Items (3):</div>
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

        <button class="place-order-button button-primary">
          Place your order
        </button>
  `;
  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHtml;
}

