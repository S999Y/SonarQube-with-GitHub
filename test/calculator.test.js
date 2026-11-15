const {
  add,
  subtract,
  multiply,
  divide,
  power,
  percentage,
  average
} = require('../src/calculator');

describe('add', () => {
  test('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('adds negative numbers', () => {
    expect(add(-2, -3)).toBe(-5);
  });

  test('rejects non numeric input', () => {
    expect(() => add('2', 3)).toThrow(TypeError);
  });
});

describe('subtract', () => {
  test('subtracts two numbers', () => {
    expect(subtract(10, 4)).toBe(6);
  });

  test('accepts decimals', () => {
    expect(subtract(1.5, 0.5)).toBe(1);
  });
});

describe('multiply', () => {
  test('multiplies two numbers', () => {
    expect(multiply(6, 7)).toBe(42);
  });

  test('multiplies by zero', () => {
    expect(multiply(9, 0)).toBe(0);
  });
});

describe('divide', () => {
  test('divides two numbers', () => {
    expect(divide(20, 5)).toBe(4);
  });

  test('throws when dividing by zero', () => {
    expect(() => divide(1, 0)).toThrow(RangeError);
  });
});

describe('power', () => {
  test('raises base to exponent', () => {
    expect(power(2, 10)).toBe(1024);
  });

  test('supports negative exponents', () => {
    expect(power(2, -1)).toBe(0.5);
  });
});

describe('percentage', () => {
  test('calculates percentage', () => {
    expect(percentage(25, 200)).toBe(12.5);
  });

  test('throws when whole is zero', () => {
    expect(() => percentage(10, 0)).toThrow(RangeError);
  });
});

describe('average', () => {
  test('calculates average of array', () => {
    expect(average([2, 4, 6, 8])).toBe(5);
  });

  test('rejects empty array', () => {
    expect(() => average([])).toThrow(TypeError);
  });

  test('rejects non array input', () => {
    expect(() => average('123')).toThrow(TypeError);
  });
});
