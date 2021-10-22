import dataScraper from "../Model/dataScraper";
import messageSender from "../Model/messageSender";
import productFilter from "../Model/productFilter";

// TODO: Add smth like boolean state to product interface and check if it's already passed filtering. Or smth else to avoid execution filter method for same object each loop cycle.

class ProductController {
  private _processedProducts: product[];
  private _url: string;
  private _messageTemplate: string;
  private _wsEndPoint: string;
  private _isRunning: boolean;
  private _priceFrom: number;
  private _priceTo: number;
  private _skipWords: string[];

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
      const productIsNew = this._processedProducts.some((processedProduct) => {
        if (!processedProduct) return false;
        return processedProduct.id !== newProduct.id;
      })
      if (productIsNew &&
        productFilter(newProduct, this._priceFrom, this._priceTo, this._skipWords)) {
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

  stop() {
    this._isRunning = false;
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default ProductController;
