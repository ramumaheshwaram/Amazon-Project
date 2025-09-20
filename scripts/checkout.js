import { renderOrderSummary } from "./checkout/orderSummary.js"; // Import the renderOrderSummary function

import { renderCheckoutHeader } from "./checkout/checkoutHeader.js"; // Import the renderCheckoutHeader function
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";

import { loadCart } from '../data/cart.js';


async function loadPage() {
  try {
    //throw 'error1';    we created manual error to test catch block

    await loadProductsFetch();
    const value = await new Promise((resolve, reject) => {
      // throw 'error2';
      loadCart(() => {
        reject('cart not loaded');
        //resolve();
      });
    });
  }
  catch (e) {
    console.log('unexpected error. Please try again later.');
  }

  renderPaymentSummary();
  renderOrderSummary();
  return 'value2'; // this get coveted into resolve  value

}
loadPage();

/*

Promise.all([
  loadProductsFetch(),
  new Promise((resolve) => {

    loadCart(() => {
      resolve();
    });
  })
]).then(() => {
  renderPaymentSummary();
  renderOrderSummary();
});

*/

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




