const pptr = require('puppeteer')

async function sendMessage(url, wsEndpoint, message) {
  const browser = await pptr.connect({
    browserWSEndpoint: wsEndpoint
  })

  const page = await browser.newPage()
  await page.goto(url)

  await page.click('#reply_show')
  await page.focus('#reply_message')
  await page.keyboard.type(message)
  await page.click('#send')
  
  await page.close()
  await browser.disconnect()
}

module.exports = sendMessage