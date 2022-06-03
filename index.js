const cors = require("cors");
const express = require("express");
const app = express();
const PORT = "8081";
const request = require("request");
const apiKey = "a1aa20bfdba29afe055d";
const urlFirstStr = "https://free.currconv.com/api/v7";
app.use(cors({ origin: "*" }));
app.listen(process.env.PORT || PORT, () => console.log(`Listening on port ${PORT}`));
app.use(express.urlencoded({extended: true}));
app.use(express.json())
const nodemailer = require("nodemailer");

app.get("/convertCurrency", (req, res) => {
  let conversionObj = JSON.parse(req.query.q);
  const symbols = `${conversionObj.firstCurrency}_${conversionObj.secondCurrency}`;
  const symbolsRev = `${conversionObj.secondCurrency}_${conversionObj.firstCurrency}`;
  let urlQuery = `convert?q=${symbols}`;
  const requestParams = {
    conversionObj,
    urlQuery,
    res,
    symbols,
    symbolsRev,
  };
  makeExternalRequest(requestParams);
});

app.get("/getCountries", (req, res) => {
  url = `${urlFirstStr}/currencies?apiKey=${apiKey}`;
  const countries = [];
  request(url, { json: true }, (err, resFromApi) => {
    if (err) {
      res.send(err);
    }
    Object.entries([resFromApi.body.results][0]).forEach(([key, value]) =>
      countries.push(value)
    );
    res.send(countries);
  });
});

function makeExternalRequest({
  conversionObj,
  urlQuery,
  res,
  symbols,
  symbolsRev,
}) {
  let urlRateTwoQuery = `convert?q=${symbolsRev}`;
  let rateTwo = 0;
  const urlRateTwo = `${urlFirstStr}/${urlRateTwoQuery}&compact=ultra&apiKey=${apiKey}`;
  const url = `${urlFirstStr}/${urlQuery}&compact=ultra&apiKey=${apiKey}`;

  request(urlRateTwo, { json: true }, (err, rateTwoFromApi) => {
    if (err) {
      console.log(err);
      return res.send(err);
    } else {
      rateTwo = rateTwoFromApi.body[symbolsRev];
      request(url, { json: true }, (err, resFromApi) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          conversionObj.date = new Date().toDateString().slice(0, 11);
          conversionObj.conversionRate = resFromApi.body[symbols];
          conversionObj.convertedAmount =
            resFromApi.body[symbols] > rateTwo
              ? resFromApi.body[symbols] * conversionObj.amount
              : conversionObj.amount / rateTwo;
          conversionObj.convertC1ToC2 = resFromApi.body[symbols];
          conversionObj.convertC2ToC1 = rateTwo;
          res.send(conversionObj);
        }
      });
    }
  });
}

app.post("/sendEmail", (req, res) => {
  if (req.body.email === null) {
    req.body.email = "Sender does not have an email";
  }
  const output = `
      <p>${req.body.name} has sent the following message:</p>
      <h3>Message</h3>
          <p> ${req.body.message}</p>
      <h3>Contact Details</h3>
      <ul>
          <li style='list-style: none;'> <b>Name</b>: ${req.body.name}</li>
          <li style='list-style: none;'> <b>Email</b>: ${req.body.email}</li>
      </ul>
      </br></br></br>
      Warm Regards<br>
      This email was sent from the Currency Rate Hub Site
      `;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mail.webgooru.co.za",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "siyabonga@webgooru.co.za",
      pass: "jvPh60sb!",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = transporter.sendMail(
    {
      from: '"Currency Rate Hub" <siyabonga@webgooru.co.za>', // sender address
      to: "siyabonga@webgooru.co.za, hlongwanesiyabonga6@gmail.com", // list of receivers
      subject: `Contact Form - ${req.body.name} ✔`, // Subject line
      html: output, // html body
    },
    (err, doc) => {
      if (!err) {
        res.send({ msg: "Email Sent Successfully!" });
      } else {
        res.send({ err: "Error Sending Email!" });
      }
    }
  );
});