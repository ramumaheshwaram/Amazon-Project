import { addToCart, cart, loadFromStorage } from '../../data/cart.js';

describe('test suite: addToCart', () => {
  it('adds an existing product to the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '1'
      }]);
      loadFromStorage();
      addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 1);

      // Assertions
      expect(cart.length).toEqual(1); // One item in the cart
      expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
      expect(cart[0].quantity).toEqual(2); // Corrected from 'quntity' to 'quantity'
      expect(localStorage.setItem).toHaveBeenCalledTimes(1); // Ensure cart is saved
    });
  });

  it('adds a new product to the cart', () => {
    // Mock localStorage to return an empty cart
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });
    loadFromStorage();

    // Add a new product
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 1);

    // Assertions
    expect(cart.length).toEqual(1); // One item in the cart
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1); // Corrected from 'quntity' to 'quantity'
    expect(localStorage.setItem).toHaveBeenCalledTimes(1); // Ensure cart is saved
  });
});