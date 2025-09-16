import { renderOrderSummary } from "./checkout/orderSummary.js"; // Import the renderOrderSummary function

import { renderCheckoutHeader } from "./checkout/checkoutHeader.js"; // Import the renderCheckoutHeader function
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";
loadProducts(() => {
  renderPaymentSummary(); // Call function to render payment summary when the script loads

  renderOrderSummary(); // Call function to render order summary when the script loads
  renderCheckoutHeader(); // Call function to render checkout header when the script loads
});

// import '../data/backend-practice.js';

// import '../data/cart-oop.js';
// import '../data/cart-class.js';




