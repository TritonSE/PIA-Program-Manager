import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS_1,
    pass: process.env.PASS_1,
  },
});

export const sendApprovalEmail = async (email: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS_1,
      to: email,
      subject: "Welcome to PIA! Your Account Has Been Approved",
      // text: `Hello,
      //     Thank you for your interest in Plant It Again.
      //     We are emailing to let you know that your account
      //     creation request has been approved.`
      html: `<p>Hello,</p>
            <p>Thank you for your interest in Plant It Again.</p>
            <p>We are emailing to let you know that your account creation request  
            has been <strong>approved</strong>.</p>`,
    });
    console.log("Approval email sent successfully");
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
};

export const sendDenialEmail = async (email: string) => {
  console.log("Sending Denial Email");
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS_1,
      to: email,
      subject: "An Update on Your PIA Account Approval Status",
      // text: `Hello,
      //         Thank you for your interest in Plant It Again.
      //         We are emailing to let you know that your account
      //         creation request has been denied.
      //         If you believe this a mistake,
      //         please contact us through our website`
      html: `<p>Hello,</p>
            <p>Thank you for your interest in Plant It Again.</p>
            <p>We are emailing to let you know that your account creation request 
            has been <strong>denied</strong>.</p>
            <p>If you believe this is a mistake, please contact us through our website.</p>`,
    });
    console.log("Denial email sent successfully");
  } catch (error) {
    console.error("Error sending denial email:", error);
  }
};
