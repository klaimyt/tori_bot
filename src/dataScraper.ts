import axios from 'axios'
import cheerio from 'cheerio'

interface product {
  name: string,
  price: number,
  id: number,
  link: string
}

async function htmlScrapingFrom(url: string): Promise<product[]> {
  const htmlFile = await axios.get(url).then(response => {
    return response.data
  })
  
  let $ = cheerio.load(htmlFile)

  const productsHTML = Array.from($('.list_mode_thumb > a'))

  const products = productsHTML.map(product => {
    $ = cheerio.load(product)
    const priceString = $('.list_price.ineuros').text()
    // Get actual number from string. Set 0 if string empty
    const price = priceString ? parseInt(priceString.replace(/[€ ]/g, '')) : 0
    // Product object
    if (!product.attribs.id) return
    return {
      name: $('.li-title').text(),
      id: parseInt(product.attribs.id.replace(/.*item_/g, '')),
      link: product.attribs.href,
      price: price
    }
  })

  return products
}

export default htmlScrapingFrom