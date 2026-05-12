import nodemailer from 'nodemailer';

export async function sendBookingConfirmationEmail(email: string, details: {
  userName: string;
  venueName: string;
  slotTime: string;
  total: number;
}) {
  try {
    // We create a test account or use environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || 'test-user',
        pass: process.env.SMTP_PASS || 'test-pass',
      },
    });

    const mailOptions = {
      from: '"SnapSlot Booking" <noreply@snapslot.com>',
      to: email,
      subject: `Booking Confirmation - ${details.venueName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px; padding: 20px;">
          <h2 style="color: #2563eb;">Your Booking is Confirmed!</h2>
          <p>Hi ${details.userName},</p>
          <p>Thank you for booking with SnapSlot. Here are your booking details:</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Venue:</strong> ${details.venueName}</p>
            <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${details.slotTime}</p>
            <p style="margin: 5px 0;"><strong>Total Paid:</strong> ₹${details.total}</p>
          </div>

          <p>Please arrive at least 15 minutes prior to your slot time.</p>
          <p>Enjoy your game!</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };

    // Note: In real app this will send email. With ethereal credentials it may log to console
    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
}
