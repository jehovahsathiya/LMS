const fs = require('fs').promises;
const nodemailer = require('nodemailer');

const sendOverdueEmail = async (user) => {
  try {
    // Load the HTML template
    console.log(user);
    
    const htmlTemplate = await fs.readFile('OverdueBookReminder.html', 'utf-8');

    // Replace placeholders with user data
    const emailBody = htmlTemplate
      .replace('{{borrowerName}}', user.borrower)
      .replace('{{isbn}}', user.isbn)
      .replace('{{uid}}', user.uid)
      .replace('{{takenDate}}', new Date(user.takenDate).toLocaleDateString())
      .replace('{{daysOverdue}}', user.daysOverdue);

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:process.env.EMAIL,
        pass:process.env.PASSWORD , // Use App Password if 2FA enabled
      },
    });

    // Define mail options
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email, // Make sure the user object has an email field
      subject: '📚 Overdue Book Reminder',
      html: emailBody,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${user.email}: ${info.response}`);
  } catch (error) {
    console.error(`❌ Error sending email:`, error.message);
  }
};
const sendNewBookEmail = async (userEmail, book) => {
    try {
      // Load the HTML template
      const htmlTemplate = await fs.readFile('NewBookAdded.html', 'utf-8');
  
      // Replace placeholders in the template with actual book data
      const emailBody = htmlTemplate
        .replace('{{title}}', book.title)
        .replace('{{authors}}', book.authors)
        .replace('{{publishedDate}}', book.publishedDate)
        .replace('{{pageCount}}', book.pageCount)
        .replace('{{shortDescription}}', book.shortDescription)
        .replace('{{genre}}', book.genre.join(', '))
        .replace('{{image}}', "http://localhost:5000/"+book.image)
        .replace('{{year}}', new Date().getFullYear());
  
      // Create email transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD, // Use App Password if 2FA enabled
        },
      });
  
      // Email options
      const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: '📚 New Book Arrived at Your Library!',
        html: emailBody,
      };
  
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ New book email sent to ${userEmail}: ${info.response}`);
    } catch (error) {
      console.error(`❌ Failed to send new book email:`, error.message);
    }
  };

  const sendReturnBookEmailToAdmin = async (adminEmail, borrower, book) => {
    try {
      const htmlTemplate = await fs.readFile('ReturnBookToAdmin.html', 'utf-8');
  
      const emailBody = htmlTemplate
        .replace('{{borrowerName}}', borrower.name)
        .replace('{{uid}}', borrower.uniqueId)
        .replace('{{email}}', borrower.email)
        .replace('{{title}}', book.title)
        .replace('{{isbn}}', book.isbn)
        .replace('{{returnedDate}}', new Date().toLocaleDateString())
        .replace('{{year}}', new Date().getFullYear());
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL,
        to: adminEmail,
        subject: `📘 Book Returned: ${book.title} by ${borrower.name}`,
        html: emailBody,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Return email sent to admin ${adminEmail}: ${info.response}`);
    } catch (error) {
      console.error(`❌ Error sending return email to admin:`, error.message);
    }
  };


  const sendReturnBookEmail = async (userEmail, book) => {
    try {
      const htmlTemplate = await fs.readFile('ReturnBookConfirmation.html', 'utf-8');
  
      const emailBody = htmlTemplate
        .replace('{{borrowerName}}', book.borrower)
        .replace('{{isbn}}', book.isbn)
        .replace('{{title}}', book.title)
        .replace('{{returnedDate}}', new Date().toLocaleDateString())
        .replace('{{year}}', new Date().getFullYear());
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: '✅ Book Return Confirmation - Library',
        html: emailBody,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Return confirmation email sent to ${userEmail}: ${info.response}`);
    } catch (error) {
      console.error(`❌ Error sending return confirmation email:`, error.message);
    }
  };
  

//

module.exports = { sendOverdueEmail ,sendNewBookEmail,sendReturnBookEmailToAdmin,sendReturnBookEmail};
