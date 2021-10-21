export default function productFilter(product: product, priceFrom?: number, priceTo?: number, words?: string[]): boolean {
  if (!product) return false
  // Filtering by price
  function priceFilter(priceFrom: number, priceTo: number) {

    const lowestPrice = (priceFrom?: number) => priceFrom ? product.price > priceFrom : true;
    const highestPrice = (priceTo?: number) => priceTo ? product.price < priceTo : true;

    return lowestPrice(priceFrom) && highestPrice(priceTo);
  }

  // Filter by words
  function wordFilter(words: string[]) {
    if (!words) return true
    for (const word of words) {
      if (product.name.toLowerCase().includes(word.toLowerCase())) return false
    }
    return true
  }

  return priceFilter(priceFrom, priceTo) && wordFilter(words)
}