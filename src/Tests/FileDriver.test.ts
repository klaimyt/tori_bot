import { filterSchema, dbSchema } from "../Model/DB/DataInterface";
import FileDriver from "../Model/DB/FileDriver";

describe("File driver db test", () => {
  const db = new FileDriver("./src/Tests/testdb.json");

  const randomInt = (max: number) => Math.floor(Math.random() * max);

  const createRandomFilter = (): filterSchema => {
    const randomBoolean = () => Math.random() < 0.5;
    if (randomBoolean()) return null;
    const lowestPrice = randomBoolean() ? randomInt(9999) : null;
    const highestPrice = randomBoolean() ? randomInt(9999) : null;
    const words = randomBoolean() ? ["ban", "word"] : null;

    return {
      lowestPrice: lowestPrice,
      highestPrice: highestPrice,
      filteredWords: words,
    };
  };

  const createRandomProducts = (numberOfProducts: number) => {
    const products: dbSchema[] = [];
    for (let i = 0, id = db.getLastId() + 1; i < numberOfProducts; i++, id++) {
      products.push({
        url: `tori.fi/${randomInt(999999)}`,
        filter: createRandomFilter(),
        id: id,
      });
    }
    return products;
  };

  const getRandomProduct = () => {
    return randomProducts[randomInt(randomProducts.length - 1)];
  }

  const randomProducts = createRandomProducts(10);

  // This tests are designed to start with empty db
  it("Remove all data from db", () => {
    db.removeAll();
    expect(db.getAll()).toEqual([]);
  });

  it("Add products to db", () => {
    randomProducts.forEach((product) =>
      expect(db.add(product.url, product.filter)).toBe(true)
    );
  });

  it("Check that each id is individual", () => {
    const allProducts = db.getAll();
    if (allProducts.length > 0) {
      const idsSet = new Set(allProducts.map((product) => product.id));
      expect(idsSet.size).toBe(allProducts.length);
    }
  });

  it("Get all products and verify them", () => {
    const products = db.getAll();

    for (const product of products) {
      const foundProduct = randomProducts.find(
        (randProduct) => randProduct.id === product.id
      );

      expect(JSON.stringify(foundProduct)).toBe(JSON.stringify(product));
    }
  });

  it("Get product by id", () => {
    const randomProduct = getRandomProduct()
    expect(db.getById(randomProduct.id)).toEqual(randomProduct)
    expect(db.getById(randomProduct.id + 1)).not.toEqual(randomProduct)
    expect(db.getById(db.getLastId() + 2)).toBeNull()
  });

  it("Remove product by id", () => {
    const randomProduct = getRandomProduct()
    expect(db.remove(db.getLastId() + 10)).toBeNull();
    expect(db.remove(randomProduct.id)).toEqual(randomProduct);
    expect(db.getById(randomProduct.id)).toBeNull();
  });

  it("Patch exists product with new data", () => {
    const randomProduct = getRandomProduct()
    const newProduct = {
      url: 'tori.fi/1253464362334sdg',
      filter: null as filterSchema,
    } 
    expect(db.update(newProduct, db.getLastId() + 10)).toBeNull()
    expect(db.update(newProduct, randomProduct.id)).toEqual(randomProduct)
    expect(db.getById(randomProduct.id)).toEqual({...newProduct, id: randomProduct.id})
    expect(db.getById(randomProduct.id)).not.toEqual(randomProduct)
  });
});
