const { run } = require('../src/index');

describe('run', () => {
  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  test('returns the four arithmetic results', () => {
    expect(run()).toEqual({
      addition: 20,
      subtraction: 4,
      multiplication: 96,
      division: 1.5
    });
  });

  test('prints each result', () => {
    run();
    expect(logSpy).toHaveBeenCalledWith('addition: 20');
    expect(logSpy).toHaveBeenCalledWith('subtraction: 4');
    expect(logSpy).toHaveBeenCalledWith('multiplication: 96');
    expect(logSpy).toHaveBeenCalledWith('division: 1.5');
  });
});
