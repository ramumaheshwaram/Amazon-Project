import { renderOrderSummary } from '../../scripts/checkout/orderSummary.js';
import { loadFromStorage } from '../../data/cart.js';


describe('test suite : Order Summary Tests', () => {
  it('display the cart', () => {
    document.querySelector('.js-test-container').innerHTML = `<div class="js-order-summary"></div>
    <div class="js-checkout-header"></div>`;
    const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6'; // Hardcoded product ID
    const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d'; // Hardcoded product ID

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([
        {
          productId: productId1, // Hardcoded product ID
          quantity: 2,// Default quantity
          deliveryOptionId: '1' // Default delivery option ID
        },
        {
          productId: productId2, // Hardcoded product ID
          quantity: 1, // Default quantity
          deliveryOptionId: '2' // Default delivery option ID
        }
      ]);
    });
    loadFromStorage();
    renderOrderSummary();
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);
    expect(document.querySelector(`.js-product-quantity-${productId1}`).innerText).toContain('Quantity: 2');
    expect(document.querySelector(`.js-product-quantity-${productId2}`).innerText).toContain('Quantity: 1');
  });
  it('removes a product', () => {
    spyOn(localStorage, 'setItem');
    document.querySelector('.js-test-container').innerHTML = `<div class="js-order-summary"></div>`;
    const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6'; // Hardcoded product ID
    const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d'; // Hardcoded product ID

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([
        {
          productId: productId1, // Hardcoded product ID
          quantity: 2,// Default quantity
          deliveryOptionId: '1' // Default delivery option ID
        },
        {
          productId: productId2, // Hardcoded product ID
          quantity: 1, // Default quantity
          deliveryOptionId: '2' // Default delivery option ID
        }
      ]);
    });
    loadFromStorage();

    renderOrderSummary();
    document.querySelector(`.js-delete-link-${productId1}`).click();
  });
});