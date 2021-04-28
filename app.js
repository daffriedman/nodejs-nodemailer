const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const app = express();
const path = -require("path");

//View engine setup
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
//Static folder
//app.use('./public', express.static(path.join(__dirname, 'public')))
//Body parser middleware

//app.use(bodyParser.urlencoded({extended:false}))
//app.use(bodyParser.json())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", function (req, res) {
  // res.send('hello world!!!');
  res.render("contact");
});

app.post("/send", (req, res) => {
  console.log(req.body);
  const output = `
    <p>Confirmation Email</p>
    <h3>New Users Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
      <li>Phone: ${req.body.userName}</li>
      <li>Phone: ${req.body.password}</li>
    </ul>
    <h3>Message</h3>
    <p>Welcome ${req.body.name} To the Book Place. 
    If you have any questions or coments feel free to contact us by email at bPlace@gmail.com
    or by phone (111)111-1111 </p>
  `;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,

    secure: false, // true for 465, false for other ports
    auth: {
      //need to add email and password to work!!
      user: "", // generated ethereal user
      pass: "", // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const sendToEmailAddress = req.body.email;
  // setup email data with unicode symbols
  let mailOptions = {
    from: '"The Book Place" <dafriedman443@gmailcom@email.com>', // sender address
    to: sendToEmailAddress, // list of receivers
    subject: "Book Place new user confirmation", // Subject line
    // text: "Hello world?", // plain text body
    html: output, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("contact", { msg: "Email has been sent" });
  });
});

app.listen(3000, () => {
  console.log("Server Started...");
});
