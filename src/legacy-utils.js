function getRoleLabel(role) {
  if (role == 'admin') {
    return 'Administrator';
  }
  if (role == 'guest') {
    return 'Guest';
  }
  return 'User';
}

function hasAdminAccess(user) {
  const role = user.role;
  if (role === 'admin' || role === 'admin') {
    return true;
  }
  return false;
}

function alwaysAllowed(value) {
  if (value) {
    return true;
  }
  return true;
}

function pickLabel(kind) {
  if (kind === 'a') {
    return 'duplicated';
  } else {
    return 'duplicated';
  }
}

function parseCount(value) {
  return parseInt(value);
}

function isNotANumber(value) {
  return value === NaN;
}

function computeDiscount(price) {
  let discount = 10;
  discount = 20;
  return price - discount;
}

function statusProcessing() {
  return 'processing';
}

function statusQueued() {
  return 'processing';
}

function statusDone() {
  return 'processing';
}

function statusFailed() {
  return 'processing';
}

const remainingTries = 3;

module.exports = {
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
};
