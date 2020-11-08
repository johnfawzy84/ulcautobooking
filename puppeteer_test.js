const { argv } = require('process');
const puppeteer = require('puppeteer');
var schedule = require('node-schedule');
//const no_of_persons = process.argv[2];
var rule = new schedule.RecurrenceRule();
//rule.dayOfWeek = [0, new schedule.Range(4, 6)];
rule.hour = 21;
rule.minute = 23;
rule.tz = "CET";
const persons = ['John Iskander','Jackline Tawadors'];
const handynr = '015778442307';//process.argv[3];
const email = 'john.iskander@gmx.de';//process.argv[4];

let mytxt = `Handy ${handynr}
email:${email}
Reserver for :${persons.length}
`;
// no_of_valid_args = (no_of_persons*2)+2+3
// if (argv.length != no_of_valid_args)
// {
//     console.log("Please enter all needed data ! you need to enter : (number of reservations) (Phone number) (email) {according to the number of reservations repeat the followning!}(first name of first guest) (Last name of first guest) ...");
// }

console.log (mytxt);
var j = schedule.scheduleJob(rule,
function() { 
  (async () => {
  console.log("Executing the automation of form filling!!");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://tickets.urbanlifechurch.de/eventOverview.php');
  await Promise.all([
      page.waitForNavigation(),
      page.click("#overview > tbody > tr:nth-child(2) > td.bookingAction > a.linkButton.dobooking")
  ]);
  await page.pdf({path: '01_GottesDienst11HrForm.pdf', format: 'A4'});
  try
  {
    const phone = await page.$("#phone");
    console.log("handynummer : ",handynr);
    await phone.type(handynr);
    const mail = await page.$("#mail");
    await mail.type(email);
    const agb = await page.$("#agb");
    await agb.click();
    const seats = await page.$("#seats");
    await seats.type(no_of_persons.toString());  
  }
  catch(err)
  {
      console.log(err)
  }
  await page.pdf({path: '02_GottesDienst11HrFormFilled.pdf', format: 'A4'});

  await Promise.all([
      page.waitForNavigation(),
      page.click("#submitStepA")
  ]);
  
  await page.pdf({path: '03_GottesDienst11HrForm2.pdf', format: 'A4'});

  console.log("Filling Persons Names!!");
  try{
      for(i=0,j=5;i<persons.length;i++,j+=2)
      {
        console.log(`Entering Person[${i}]
        First name : ${persons[i].split(' ')[0]}
        Last name : ${persons[i].split(' ')[1]}`);
        const per_vorname = await page.$(`#person\\[${i}\\]\\[firstname\\]`);
        await per_vorname.type(persons[i].split(' ')[0]);
        const per_nachname = await page.$(`#person\\[${i}\\]\\[surname\\]`);
        await per_nachname.type(persons[i].split(' ')[1]);
      }
  }
  catch(err)
  {
    console.log(err)
  }
  await page.pdf({path: '04_GottesDienst11HrForm2Filled.pdf', format: 'A4'});
  await Promise.all([
    page.waitForNavigation(),
    page.click("#submitStepB")
    ]);
    await page.pdf({path: '05_BuchungDetails.pdf', format: 'A4'});
    console.log("Booking for the Sunday Service completed :) Finished!!!")
  await browser.close();
})
();}
);