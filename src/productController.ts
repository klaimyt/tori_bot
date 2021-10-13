import dataScraper from './dataScraper'
import messageSender from './messageSender'

class ProductController {
  processedProducts: product[]
  url: string
  messageTemplate: string
  wsEndPoint: string
  isRunning: boolean

  constructor(delay: number, url: string, messageTemplate: string, wsEndPoint: string) {
    dataScraper(url).then(products => this.processedProducts = products)
    this.url = url
    this.messageTemplate = messageTemplate
    this.wsEndPoint = wsEndPoint
    this.isRunning = true
    this.start(delay)
  }

  async update() {
    const newProducts = await dataScraper(this.url)
    for (let newProduct of newProducts) {
      if (newProduct && !this.processedProducts.some(processedProduct => processedProduct.id === newProduct.id)) { // Check if there is new product
        this.sendMessage(newProduct.link)
        this.processedProducts.push(newProduct)
      }
    }
  }

  sendMessage(url: string) {
    messageSender(url, this.wsEndPoint, this.messageTemplate)
  }

  /**
   * 
   * @param delay Delay between each request to site.
   */
  async start(delay: number) {
    while (this.isRunning) {
      this.update()
      await this.sleep(delay)
    }
  }

  stop() {
    this.isRunning = false
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default ProductController