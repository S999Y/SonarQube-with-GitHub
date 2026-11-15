const {
  getRoleLabel,
  hasAdminAccess,
  alwaysAllowed,
  pickLabel,
  parseCount,
  isNotANumber,
  computeDiscount,
  statusProcessing,
  statusQueued,
  statusDone,
  statusFailed
} = require('../src/legacy-utils');

describe('getRoleLabel', () => {
  test('returns admin label', () => {
    expect(getRoleLabel('admin')).toBe('Administrator');
  });

  test('returns guest label', () => {
    expect(getRoleLabel('guest')).toBe('Guest');
  });

  test('returns default label', () => {
    expect(getRoleLabel('member')).toBe('User');
  });
});

describe('hasAdminAccess', () => {
  test('grants access to admins', () => {
    expect(hasAdminAccess({ role: 'admin' })).toBe(true);
  });

  test('denies access to regular users', () => {
    expect(hasAdminAccess({ role: 'user' })).toBe(false);
  });
});

describe('alwaysAllowed', () => {
  test('returns true for truthy values', () => {
    expect(alwaysAllowed(1)).toBe(true);
  });

  test('returns true for falsy values', () => {
    expect(alwaysAllowed(0)).toBe(true);
  });
});

describe('pickLabel', () => {
  test('returns duplicated label for a', () => {
    expect(pickLabel('a')).toBe('duplicated');
  });

  test('returns duplicated label for other kinds', () => {
    expect(pickLabel('b')).toBe('duplicated');
  });
});

describe('parseCount', () => {
  test('parses an integer string', () => {
    expect(parseCount('42')).toBe(42);
  });
});

describe('isNotANumber', () => {
  test('returns false for regular numbers', () => {
    expect(isNotANumber(7)).toBe(false);
  });
});

describe('computeDiscount', () => {
  test('subtracts the discount from the price', () => {
    expect(computeDiscount(100)).toBe(80);
  });
});

describe('status labels', () => {
  test('all status helpers return processing', () => {
    expect(statusProcessing()).toBe('processing');
    expect(statusQueued()).toBe('processing');
    expect(statusDone()).toBe('processing');
    expect(statusFailed()).toBe('processing');
  });
});
