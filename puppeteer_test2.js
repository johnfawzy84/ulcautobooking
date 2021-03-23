const puppeteer = require('puppeteer');
async function outputfile(page,printid,pdf)
{
  if(pdf)
  {
  //   await page.pdf({path: printid+'.pdf',format:'a4'});
  // }
  // else
  // {
    await page.screenshot({path: printid+".png",fullpage:true})
  }
  console.log("##[debug]screenshot "+printid+" been taken!");
}
async function clickButton(page,buttonid,printid,pdf)
{
  await page.waitForSelector(buttonid);
  const button = await page.$(buttonid);
  await button.click();
  await outputfile(page,printid,pdf);
  // console.log("##[debug]screenshot"+ printid +" been taken!");
}

async function fill_text(page,txtid,content,printid,pdf)
{
  await page.waitForSelector(txtid);
  const textbox = await page.$(txtid);
  await textbox.type(content);
  await outputfile(page,printid,pdf);
  // console.log("##[debug]screenshot "+ printid +" been taken!");
}

async function nativeClick(page, button) {
  await page.evaluate((button) => {
    document.querySelector(button).click();
  }, button);
}

(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  const pdf = false;
  const secretid = "XYA8Z4TUJJ4B";
  await page.setUserAgent("I used Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36");
  await page.goto('https://005-iz.impfterminservice.de/impftermine/service?plz=71636', { waitUntil: "networkidle0",timeout: 60000});
  //await page.goto('https://005-iz.impfterminservice.de/impftermine/suche/NZAV-JXHX-5CYP/71636', { waitUntil: "networkidle0",timeout: 60000});

  // await page.pdf({path: '00_example.pdf',format:'a4'});
  outputfile(page,
    "00_Init",
    pdf);
  
  //cookies button click
  await clickButton(page,
    "body > app-root > div > div > div > div.row.no-gutters.user-select-none > div.col-10.offset-1.col-md-6.offset-md-0.text-center.text-md-left > div > div.col-12.col-md-6.pr-md-3 > a",
    "01_cookiesbutton",
    pdf);


  terminsearchaccepted = false;
  refreshcounter = 1;

  await page.setUserAgent("I used Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36");
  await page.goto('https://005-iz.impfterminservice.de/impftermine/service?plz=71636', { waitUntil: "networkidle0",timeout: 60000});
  //await page.goto('https://005-iz.impfterminservice.de/impftermine/suche/NZAV-JXHX-5CYP/71636', { waitUntil: "networkidle0",timeout: 60000});

  //cookies button click
  await clickButton(page,
    "body > app-root > div > div > div > div.row.no-gutters.user-select-none > div.col-10.offset-1.col-md-6.offset-md-0.text-center.text-md-left > div > div.col-12.col-md-6.pr-md-3 > a",
    "01_cookiesbutton",
    pdf);
  while(!(terminsearchaccepted))  
  {
    await page.setUserAgent("I used Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36");
    await page.goto('https://005-iz.impfterminservice.de/impftermine/service?plz=71636', { waitUntil: "networkidle0",timeout: 60000});
    //await page.goto('https://005-iz.impfterminservice.de/impftermine/suche/NZAV-JXHX-5CYP/71636', { waitUntil: "networkidle0",timeout: 60000});
  
    // await page.pdf({path: '00_example.pdf',format:'a4'});
    outputfile(page,
      "00_"+String(refreshcounter)+"_Init",
      pdf);

    // //ja button click
    await clickButton(page,
      "body > app-root > div > app-page-its-login > div > div > div:nth-child(2) > app-its-login-user > div > div > app-corona-vaccination > div:nth-child(2) > div > div > label:nth-child(1) > span",
      "02_"+String(refreshcounter)+"_jabutton",
      pdf);


  //fill the filed with the code value
  await fill_text(page,
    "body > app-root > div > app-page-its-login > div > div > div:nth-child(2) > app-its-login-user > div > div > app-corona-vaccination > div:nth-child(3) > div > div > div > div.ets-login-form-section.in > app-corona-vaccination-yes > form:nth-child(2) > div:nth-child(1) > label > app-ets-input-code > div > div:nth-child(1) > label > input",
    secretid,
    "03_"+String(refreshcounter)+"_txtfld1",
    pdf);
  
  //click the Termin suchen button
  await clickButton(
    page,
    "body > app-root > div > app-page-its-login > div > div > div:nth-child(2) > app-its-login-user > div > div > app-corona-vaccination > div:nth-child(3) > div > div > div > div.ets-login-form-section.in > app-corona-vaccination-yes > form.ng-pristine.ng-touched.ng-valid > div:nth-child(2) > button",
    "04_"+String(refreshcounter)+"_Terminsuchenbutton",
    pdf);

    failurehappened = (await page.content()).match(".*unzulässig.*");
    console.log(failurehappened);
    if (failurehappened)
    {
      await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
      outputfile(page,"04_"+String(refreshcounter)+"_Refresh",pdf);
      terminsearchaccepted = false;
      refreshcounter += 1;
      continue;
    }
    else
    {
      terminsearchaccepted = true;
    }

    await page.setUserAgent("I used Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36");
    await page.goto("https://005-iz.impfterminservice.de/impftermine/suche/XYA8-Z4TU-JJ4B/71636");
    await outputfile(page,"05_terminsuche2",pdf);
  
    await clickButton(
      page,
      "body > app-root > div > app-page-its-search > div > div > div:nth-child(2) > div > div > div:nth-child(5) > div > div:nth-child(1) > div.its-search-step-body > div.its-search-step-content > button",
      "06_Terminsuchen2button",
      true);
  
    // buttonid = "#itsSearchAppointmentsModal > div > div > div.modal-body > div > div > form > div:nth-child(2) > button:nth-child(1)"
    // await page.waitForSelector(buttonid);
    const is_disabled = await page.$('#itsSearchAppointmentsModal > div > div > div.modal-body > div > div > form > div:nth-child(2) > button:nth-child(1)[disabled]') !== null;
    // const btnState = await page.waitForSelector("#itsSearchAppointmentsModal > div > div > div.modal-body > div > div > form > div:nth-child(2) > button:nth-child(1) ([disabled])");
    console.log(is_disabled);
    if (is_disabled)
    {
      terminsearchaccepted = false;
    }
  }


  await browser.close();
})();
