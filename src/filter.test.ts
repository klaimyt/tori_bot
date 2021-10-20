import productFilter from './productFilter'

const product1 = {
  name: "Asus rog rtx 3070 super",
  price: 750,
  id: 123231,
  link: "tori.fi",
};

const product2 = {
  name: "Gigabyte aourus rtx 3080 ti",
  price: 1350,
  id: 122331,
  link: "tori.fi",
}

test("Basic case without any filter", () => {
  expect(productFilter(product1)).toBe(true)
})

test("Price filter only", () => {
  expect(productFilter(product1, 400, 800)).toBe(true)
  expect(productFilter(product1, 100, 700)).toBe(false)
  expect(productFilter(product2, 1000)).toBe(true)
  expect(productFilter(product1, 1000)).toBe(false)
  expect(productFilter(product1, null, 400)).toBe(false)
  expect(productFilter(product2, null, 2000)).toBe(true)
})

test("Words only", () => {
  expect(productFilter(product2, null, null, ['3070', 'asus'])).toBe(true)
  expect(productFilter(product1, null, null, ['3070', 'asus'])).toBe(false)
  expect(productFilter(product2, null, null, ['3070', 'gigabyte'])).toBe(false)
})