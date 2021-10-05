const pptr = require('puppeteer')
//Login data
const {email, password} = require('./secret.js') 

async function main() {
  const browser = await pptr.launch({
    headless: false,
    slowMo: 100
  })
  const page = await browser.newPage()
  await page.goto('https://tori.fi/tili')
  
  // Accept coockies
  const coockieFrameObject = await page.$('#sp_message_iframe_433571')
  const coockieFrame = await coockieFrameObject.contentFrame()
  await coockieFrame.click('#notice > div.message-component.message-row.bottom-row > button.message-component.message-button.no-children.focusable.buttons-row.sp_choice_type_11.last-focusable-el')

  // Log in to tori
  await page.click('#login_sa_mypages')
  // Entering login data
  await page.waitForSelector('body > div.MuiDialog-root.MobileTeaser__dialog___DO1_c > div.MuiDialog-container.MuiDialog-scrollPaper.MobileTeaser__scrollPaper___2Rp_8 > div > div.MobileTeaser__button___2rGdj > button')
  await page.click('body > div.MuiDialog-root.MobileTeaser__dialog___DO1_c > div.MuiDialog-container.MuiDialog-scrollPaper.MobileTeaser__scrollPaper___2Rp_8 > div > div.MobileTeaser__button___2rGdj > button')
  await page.focus('#email')
  await page.keyboard.type(email)
  await page.keyboard.press("Enter")
  await page.waitForTimeout(400)
  await page.focus('#password')
  await page.keyboard.type(password)
  await page.keyboard.press("Enter")
}

main()