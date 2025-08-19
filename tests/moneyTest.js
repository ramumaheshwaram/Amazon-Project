import { formateCurrency } from '../scripts/utils/money.js';

// this is a basic test case

console.log('test suite for formateCurrency ');

console.log('convert cents into dollars ');


if (formateCurrency(2095) === '20.95') {
  console.log('Test passed: formateCurrency(2095) returns "20.95"');

}
else {
  console.log('Test failed: formateCurrency(2095) does not return "20.95"');

}

//below tests are edge cases

console.log('workd with zero');


if (formateCurrency(0) === '0.00') {
  console.log('Test passed: formateCurrency(0) returns "0.00"');

}
else {
  console.log('Test failed: formateCurrency(0) does not return "0.00"');

}
console.log('round up to the nearest cent');


if (formateCurrency(2000.5) === '20.01') {
  console.log('Test passed');

}
else {
  console.log('Test failed');

}
if (formateCurrency(2000.4) === '20.00') {
  console.log('Test passed');

}
else {
  console.log('Test failed');

}