const axios = require('axios')
const cheerio = require('cheerio')

async function htmlScrapingFrom(url) {
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
    const id = product.attribs.id ? product.attribs.id : product.childNodes[1].attribs.id
    // Product object
    return {
      name: $('.li-title').text(),
      id: id.replace(/.*item_/g, ''),
      link: product.attribs.href,
      price: price
    }
  })

  return products
}

module.exports = htmlScrapingFrom