import { cart } from "../../data/cart.js"; // Import the cart object
export function renderCheckoutHeader() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity; // Calculate total quantity of items in the cart
  });
  const checkoutHeaderHTML = `
 <div class="header-content">
      <div class="checkout-header-left-section">
        <a href="index.html">
          <img class="amazon-logo" src="images/logo.png">
          <img class="logo" src="images/logo.png">
        </a>
      </div>

      <div class="checkout-header-middle-section">
        Checkout (<a class="return-to-home-link js-return-to-home-link" href="index.html"> ${cartQuantity} items</a>)
      </div>

      <div class="checkout-header-right-section">
        <img src="images/icons/checkout-lock-icon.png">
      </div>
    </div>
`;
  document.querySelector('.js-checkout-header').innerHTML = checkoutHeaderHTML; // Render the header HTML into the page

}
renderCheckoutHeader();