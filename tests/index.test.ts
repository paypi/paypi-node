import PayPI from '../src/index';

test('adds 1 + 2 to equal 3', () => {
  let s = new PayPI('123123');
  expect(s.test(4)).toBe(4);
});
