import dataScraper from "./dataScraper";
import messageSender from "./messageSender";

// TODO: Add smth like boolean state to product interface and check if it's already passed filtering. Or smth else to avoid execution filter method for same object each loop cycle.

class ProductController {
  private _processedProducts: product[];
  private _url: string;
  private _messageTemplate: string;
  private _wsEndPoint: string;
  private _priceFrom: number;
  private _priceTo: number;
  private _skipWords: string[];
  private _isRunning: boolean;

  constructor(
    delay: number,
    url: string,
    messageTemplate: string,
    wsEndPoint: string
  ) {
    dataScraper(url).then((products) => (this._processedProducts = products));
    this._url = url;
    this._messageTemplate = messageTemplate;
    this._wsEndPoint = wsEndPoint;
    this._isRunning = true;
    this.start(delay);
  }

  private async update() {
    const newProducts = await dataScraper(this._url);
    for (let newProduct of newProducts) {
      if (this.filter(newProduct)) {
        this.sendMessage(newProduct.link);
        this._processedProducts.push(newProduct);
      }
    }
  }

  private sendMessage(url: string) {
    messageSender(url, this._wsEndPoint, this._messageTemplate);
  }

  /**
   *
   * @param delay Delay between each request to site.
   */
  async start(delay: number) {
    while (this._isRunning) {
      this.update();
      await this.sleep(delay);
    }
  }

  private filter(product: product): boolean {
    // Filtering by price
    const priceFilter = (): boolean => {
      const fromPrice = (lowestPrice?: number): boolean => {
        return (product.price > lowestPrice) ?? true;
      };

      const highestPrice = (highestPrice?: number): boolean => {
        return (product.price < highestPrice) ?? true;
      };

      return fromPrice(this._priceFrom) && highestPrice(this._priceTo);
    };

    // Filtering by words in name
    const wordFilter = (): boolean => {
      for (const word of this._skipWords) {
        if (product.name.includes(word)) return true
      }
      return false
    }

    // Method return
    return (
      product &&
      priceFilter() &&
      wordFilter() &&
      this._processedProducts.some((processedProduct) => {
        // Check if there is new product
        if (!processedProduct) return false;
        return processedProduct.id !== product.id;
      })
    )
  }

  stop() {
    this._isRunning = false;
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default ProductController;
