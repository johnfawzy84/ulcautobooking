const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.duolingo.com/');
  await page.screenshot({path: 'example.png'});
  console.log("##[debug]screenshot been taken!");
  await browser.close();
})();
