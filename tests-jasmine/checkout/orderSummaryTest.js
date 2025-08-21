import { renderOrderSummary } from '../../scripts/checkout/orderSummary.js';
import { loadFromStorage } from '../../data/cart.js';

describe('test suite: Order Summary Tests', () => {
  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  beforeEach(() => {
    // Set up the DOM
    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-order-summary"></div>
      <div class="js-checkout-header"></div>
    `;

    // Mock localStorage.getItem
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([
        {
          productId: productId1,
          quantity: 2,
          deliveryOptionId: '1'
        },
        {
          productId: productId2,
          quantity: 1,
          deliveryOptionId: '2'
        }
      ]);
    });

    // Mock localStorage.setItem for tests that modify storage
    spyOn(localStorage, 'setItem');

    // Load cart data and render
    loadFromStorage();
  });

  afterEach(() => {
    // Clean up DOM
    document.querySelector('.js-test-container').innerHTML = '';
    // Reset spies
    localStorage.getItem.calls.reset();
    localStorage.setItem.calls.reset();
  });

  it('displays the cart', () => {
    renderOrderSummary();
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);
    expect(document.querySelector(`.js-product-quantity-${productId1}`).innerText).toContain('Quantity: 2');
    expect(document.querySelector(`.js-product-quantity-${productId2}`).innerText).toContain('Quantity: 1');
  });

  it('removes a product', () => {
    renderOrderSummary();
    document.querySelector(`.js-delete-link-${productId1}`).click();
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(1);
    expect(document.querySelector(`.js-product-quantity-${productId1}`)).toBeNull();
    expect(document.querySelector(`.js-product-quantity-${productId2}`).innerText).toContain('Quantity: 1');
  });
});