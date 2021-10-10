import pptr from 'puppeteer'

async function sendMessage(url: string, wsEndpoint: string, message: string) {
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

export default sendMessage