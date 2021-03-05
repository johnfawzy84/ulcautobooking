const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent("I used Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36");
  await page.goto('https://005-iz.impfterminservice.de/impftermine/service?plz=71636', { waitUntil: "networkidle0",timeout: 60000});

  await page.pdf({path: '00_example.pdf',format:'a4'});
  console.log("##[debug]screenshot been taken!");

  await page.waitForSelector("body > app-root > div > div > div > div.row.no-gutters.user-select-none > div.col-10.offset-1.col-md-6.offset-md-0.text-center.text-md-left > div > div.col-12.col-md-6.pr-md-3 > a");
  const cookiesbutton = await page.$("body > app-root > div > div > div > div.row.no-gutters.user-select-none > div.col-10.offset-1.col-md-6.offset-md-0.text-center.text-md-left > div > div.col-12.col-md-6.pr-md-3 > a");
  await cookiesbutton.click();

  await page.pdf({path: '01_example.pdf',format:'a4'});
  console.log("##[debug]screenshot been taken!");

  await page.waitForSelector("body > app-root > div > app-page-its-login > div > div > div:nth-child(2) > app-its-login-user > div > div > app-corona-vaccination > div:nth-child(2) > div > div > label:nth-child(1) > span");
  const jabutton = await page.$("body > app-root > div > app-page-its-login > div > div > div:nth-child(2) > app-its-login-user > div > div > app-corona-vaccination > div:nth-child(2) > div > div > label:nth-child(1) > span");
  await jabutton.click();
//await page.screenshot({path: 'example2.png', fullPage:true});
  await page.pdf({path: '02_example.pdf',format:'a4'});
  console.log("##[debug]screenshot2 been taken!");
  await browser.close();
})();
