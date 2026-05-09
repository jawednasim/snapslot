import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "user@example.com",
    pass: process.env.SMTP_PASS || "pass123",
  },
});

export const sendBookingConfirmation = async (
  to: string,
  bookingDetails: {
    userName: string;
    venueName: string;
    location: string;
    date: string;
    time: string;
    amount: number;
    bookingId: string;
  }
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">Booking Confirmed!</h2>
      <p>Hi ${bookingDetails.userName},</p>
      <p>Your booking at <strong>${bookingDetails.venueName}</strong> has been successfully confirmed.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #334155;">Booking Details</h3>
        <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
        <p><strong>Venue:</strong> ${bookingDetails.venueName}</p>
        <p><strong>Location:</strong> ${bookingDetails.location}</p>
        <p><strong>Date:</strong> ${bookingDetails.date}</p>
        <p><strong>Time:</strong> ${bookingDetails.time}</p>
        <p><strong>Amount Paid:</strong> ₹${bookingDetails.amount}</p>
      </div>
      
      <p>We look forward to hosting you!</p>
      <p>Best regards,<br/>The Turf Booking Team</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Turf Booking" <${process.env.SMTP_FROM || 'noreply@example.com'}>`,
      to,
      subject: `Booking Confirmed: ${bookingDetails.venueName}`,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
