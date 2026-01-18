import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  try {
    // If SMTP is not configured, log and return without throwing
    if (!process.env.SMTP_HOST && !process.env.SMTP_SERVICE) {
      console.warn("sendEmail: SMTP not configured. Skipping email to:", email);
      return { success: false, reason: "SMTP not configured" };
    }

    const transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const options = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: subject,
      text: message,
    };

    try {
      const info = await transporter.sendMail(options);
      console.log("sendEmail: email sent to", email, "id:", info?.messageId);
      return { success: true, info };
    } catch (sendErr) {
      console.error("sendEmail: failed to send email to", email, sendErr);
      return { success: false, reason: sendErr?.message || sendErr };
    }
  } catch (err) {
    console.error("sendEmail: unexpected error", err);
    return { success: false, reason: err?.message || err };
  }
};
