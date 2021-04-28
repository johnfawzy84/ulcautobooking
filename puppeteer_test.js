const { argv, exit } = require("process");
const puppeteer = require("puppeteer");
ind = -1;
async function find_service(page) {
    const alternativeRowsCounts = await page.$$eval(
        "#overview > tbody > tr",
        (elements) => elements.length
    );
    console.log(`Number of available service: ${alternativeRowsCounts}`);
    for (i = 1; i < alternativeRowsCounts; i++) {
        //#overview > tbody > tr:nth-child(1) > td.title
        //#overview > tbody > tr:nth-child(1) > td.title
        //#overview > tbody > tr:nth-child(1) > td.date
        console.log("Services are listed, finding 11Uhr service!");
        tableCellName = await page.$eval(
            "#overview > tbody > tr:nth-child(" + i.toString() + ") > td.title",
            (el) => el.innerHTML
        );
        numberOfRemainingSeats = await page.$eval(
            "#overview > tbody > tr:nth-child(" + i.toString() + ") > td.seats",
            (el) => el.innerHTML
        );
        const tableCellName2 = await page.$x(
            '//*[@id="overview"]/tbody/tr[1]/td[2]'
        );
        console.log("tableCell:" + tableCellName);
        if (tableCellName.includes("11Uhr")) {
            console.log("Found it!! it is number:" + i.toString());
            console.log("Number Of remaining seats: " + numberOfRemainingSeats);
            ind = i;
            break;
        }
    }
}

//var schedule = require('node-schedule');
const no_of_persons = process.argv[2];
/*var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(4, 6)];
rule.hour = 18;
rule.minute = 03;
rule.tz = "CET";*/
const handynr = process.argv[3];
const email = process.argv[4];

let mytxt = `Handy ${handynr}
email:${email}
Reserver for :${no_of_persons}
`;
no_of_valid_args = no_of_persons * 2 + 2 + 3;
if (argv.length != no_of_valid_args) {
    console.log(
        "Please enter all needed data ! you need to enter : (number of reservations) (Phone number) (email) {according to the number of reservations repeat the followning!}(first name of first guest) (Last name of first guest) ..."
    );
}

console.log(mytxt);
//var j = schedule.scheduleJob(rule,
//function() {
(async () => {
    console.log("Executing the automation of form filling!!");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        //calling the main booking page
        await page.goto("https://tickets.urbanlifechurch.de");
        //await page.goto("C:\\Users\\johni\\first-app\\NotMainService.html");
        await page.pdf({
            path: "00_" + handynr + "_MainPage.pdf",
            format: "A4",
        });
        notavailableticket = await page.evaluate(() => {
            const tds = Array.from(document.querySelectorAll("table tr td"));
            return tds.map((td) => td.innerText);
        });
        console.log(notavailableticket);
        counter = 0;
        while (
            notavailableticket[4].includes("keine Veranstaltungen") ||
            ind === -1
        ) {
            await page.reload({
                waitUntil: ["networkidle0", "domcontentloaded"],
            });
            notavailableticket = await page.evaluate(() => {
                const tds = Array.from(
                    document.querySelectorAll("table tr td")
                );
                return tds.map((td) => td.innerText);
            });
            console.log(notavailableticket);

            if (!notavailableticket[4].includes("keine Veranstaltungen")) {
                await find_service(page);
            }
            counter += 1;
            if (counter > 500) {
                exit(1);
            } else {
                console.log(`The current refresh try ${counter}`);
            }
        }

        console.log("Found it!! it is number:" + ind.toString());

        await Promise.all([
            page.waitForNavigation(),
            page.click(
                "#overview > tbody > tr:nth-child(" +
                    ind.toString() +
                    ") > td.bookingAction > a.linkButton.dobooking > input[type=submit]"
            ),
        ]);
        await page.pdf({
            path: "01_" + handynr + "_GottesDienst11HrForm.pdf",
            format: "A4",
        });
    } catch (err) {
        console.log("can't open the page!");
        console.log(err);
        exit(1);
    }

    try {
        //filling the initial data and accepting the agb
        await page.waitForSelector("#phone");
        //await page.$eval('#phone', el => el.value = handynr);
        const phone = await page.$("#phone");
        //console.log("handynummer : ",handynr);
        await phone.type(handynr);
        await page.waitForSelector("#mail");
        //await page.$eval('#mail', el => el.value = email);
        const mail = await page.$("#mail");
        await mail.type(email);
        await page.waitForSelector("#mailRetype");
        //await page.$eval('#mailRetype', el => el.value = email);
        const mailc = await page.$("#mailRetype");
        await mailc.type(email);
        const agb = await page.$("#agb");
        await agb.click();

        await page.waitForSelector("#seats");
        // await page.$eval('#seats', el => el.value = no_of_persons.toString());
        const seats = await page.$("#seats");
        await seats.type(no_of_persons.toString());
    } catch (err) {
        console.log("error filling the data in the first form");
        console.log(err);
        exit(2);
    }
    await page.pdf({
        path: "02_" + handynr + "_GottesDienst11HrFormFilled.pdf",
        format: "A4",
    });
    //clicking the submit button for the next step
    await Promise.all([page.waitForNavigation(), page.click("#submitStepA")]);

    await page.pdf({
        path: "03_" + handynr + "_GottesDienst11HrForm2.pdf",
        format: "A4",
    });

    //filling the second form with the names
    console.log("Filling Persons Names!!");
    try {
        for (i = 0, j = 5; i < no_of_persons; i++, j += 2) {
            console.log(`Entering Person[${i}]
        First name : ${process.argv[j]}
        Last name : ${process.argv[j + 1]}`);
            //#person0firstname
            await page.waitForSelector(`#person${i}firstname`);
            const per_vorname = await page.$(`#person${i}firstname`);
            await per_vorname.type(process.argv[j]);
            //#person0surname
            await page.waitForSelector(`#person${i}surname`);
            const per_nachname = await page.$(`#person${i}surname`);
            await per_nachname.type(process.argv[j + 1]);
        }
    } catch (err) {
        console.log("Error filling the names of of the persons");
        console.log(err);
        exit(3);
    }
    await page.pdf({
        path: "04_" + handynr + "_GottesDienst11HrForm2Filled.pdf",
        format: "A4",
    });
    //submiting the information
    await Promise.all([page.waitForNavigation(), page.click("#submitStepB")]);
    await page.pdf({
        path: "05_" + handynr + "_BuchungDetails.pdf",
        format: "A4",
    });
    console.log("Booking for the Sunday Service completed :) Finished!!!");
    await browser.close();
})();
