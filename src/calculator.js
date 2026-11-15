function assertNumber(value, name) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError(`${name} must be a valid number`);
  }
}

function add(a, b) {
  assertNumber(a, 'a');
  assertNumber(b, 'b');
  return a + b;
}

function subtract(a, b) {
  assertNumber(a, 'a');
  assertNumber(b, 'b');
  return a - b;
}

function multiply(a, b) {
  assertNumber(a, 'a');
  assertNumber(b, 'b');
  return a * b;
}

function divide(a, b) {
  assertNumber(a, 'a');
  assertNumber(b, 'b');
  if (b === 0) {
    throw new RangeError('Division by zero is not allowed');
  }
  return a / b;
}

function power(base, exponent) {
  assertNumber(base, 'base');
  assertNumber(exponent, 'exponent');
  return base ** exponent;
}

function percentage(part, whole) {
  assertNumber(part, 'part');
  assertNumber(whole, 'whole');
  if (whole === 0) {
    throw new RangeError('Whole value cannot be zero');
  }
  return (part / whole) * 100;
}

function average(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new TypeError('numbers must be a non-empty array');
  }
  const total = numbers.reduce((sum, value) => add(sum, value), 0);
  return divide(total, numbers.length);
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  power,
  percentage,
  average
};
