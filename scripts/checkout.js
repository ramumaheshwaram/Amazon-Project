import { renderOrderSummary } from "./checkout/orderSummary.js"; // Import the renderOrderSummary function

import { renderCheckoutHeader } from "./checkout/checkoutHeader.js"; // Import the renderCheckoutHeader function
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";

import { loadCart } from '../data/cart.js';


Promise.all([
  new Promise((resolve) => {

    loadProducts(() => {
      resolve('value1');
    });
  }),
  new Promise((resolve) => {

    loadCart(() => {
      resolve();
    });
  })
]).then(() => {
  renderPaymentSummary();
  renderOrderSummary();
});

// new Promise((resolve) => {
//   console.log('start promise');

//   loadProducts(() => {
//     console.log('finished loading');
//     resolve('value1');
//   });
// }).then((value) => {
//   console.log(value);

//   return new Promise((resolve) => {
//     console.log('start promise');

//     loadCart(() => {
//       console.log('finished  cart loading');
//       resolve();
//     });
//   });
// }).then(() => {
//   renderPaymentSummary();
//   renderOrderSummary();
// })


// loadProducts(() => {
//   loadCart(() => {
//     renderPaymentSummary(); // Call function to render payment summary when the script loads
//     renderOrderSummary(); // Call function to render order summary when the script loads
//   });
// });



// import '../data/backend-practice.js';

// import '../data/cart-oop.js';
// import '../data/cart-class.js';




