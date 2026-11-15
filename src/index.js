const { add, subtract, multiply, divide } = require('./calculator');

function run() {
  const results = {
    addition: add(12, 8),
    subtraction: subtract(12, 8),
    multiplication: multiply(12, 8),
    division: divide(12, 8)
  };

  Object.entries(results).forEach(([operation, value]) => {
    console.log(`${operation}: ${value}`);
  });

  return results;
}

if (require.main === module) {
  run();
}

module.exports = { run };
