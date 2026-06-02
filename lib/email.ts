import nodemailer from "nodemailer";

type ApplicationEmailPayload = {
  fullName: string;
  email: string;
  destinationCountry: string;
  status: string;
  trackingCode: string;
  trackingUrl: string;
};

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !port || !user || !pass || !from) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    from,
  };
}

function createTransporter() {
  const config = getSmtpConfig();

  if (!config) {
    console.warn("Email not sent: SMTP environment variables are not fully configured.");
    return null;
  }

  return {
    transporter: nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    }),
    from: config.from,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendApplicationEmails(application: ApplicationEmailPayload) {
  const mailer = createTransporter();

  if (!mailer) {
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const safeApplication = {
    fullName: escapeHtml(application.fullName),
    email: escapeHtml(application.email),
    destinationCountry: escapeHtml(application.destinationCountry),
    status: escapeHtml(application.status),
    trackingCode: escapeHtml(application.trackingCode),
    trackingUrl: escapeHtml(application.trackingUrl),
  };

  try {
    await mailer.transporter.sendMail({
      from: mailer.from,
      to: application.email,
      subject: `Application received - ${application.trackingCode}`,
      text: [
        `Dear ${application.fullName},`,
        "",
        "Your application has been submitted successfully.",
        "",
        `Full name: ${application.fullName}`,
        `Tracking code: ${application.trackingCode}`,
        `Destination country: ${application.destinationCountry}`,
        `Application status: ${application.status}`,
        `Track your application: ${application.trackingUrl}`,
        "",
        "Gifted-Faith Global Ventures",
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; color: #102033; line-height: 1.6;">
          <h2 style="color: #073b7a;">Application received</h2>
          <p>Dear ${safeApplication.fullName},</p>
          <p>Your application has been submitted successfully.</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 560px;">
            <tr><td><strong>Full name</strong></td><td>${safeApplication.fullName}</td></tr>
            <tr><td><strong>Tracking code</strong></td><td>${safeApplication.trackingCode}</td></tr>
            <tr><td><strong>Destination country</strong></td><td>${safeApplication.destinationCountry}</td></tr>
            <tr><td><strong>Application status</strong></td><td>${safeApplication.status}</td></tr>
          </table>
          <p><a href="${safeApplication.trackingUrl}" style="color: #0b4ea2; font-weight: bold;">Track your application</a></p>
          <p>Gifted-Faith Global Ventures</p>
        </div>
      `,
    });
  } catch (error) {
    console.warn("Applicant email failed:", error);
  }

  if (!adminEmail) {
    console.warn("Admin notification email not sent: ADMIN_EMAIL is not configured.");
    return;
  }

  try {
    await mailer.transporter.sendMail({
      from: mailer.from,
      to: adminEmail,
      subject: `New application submitted - ${application.trackingCode}`,
      text: [
        "A new application has been submitted.",
        "",
        `Full name: ${application.fullName}`,
        `Email: ${application.email}`,
        `Tracking code: ${application.trackingCode}`,
        `Destination country: ${application.destinationCountry}`,
        `Application status: ${application.status}`,
        `Tracking page: ${application.trackingUrl}`,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; color: #102033; line-height: 1.6;">
          <h2 style="color: #073b7a;">New application submitted</h2>
          <p><strong>Full name:</strong> ${safeApplication.fullName}</p>
          <p><strong>Email:</strong> ${safeApplication.email}</p>
          <p><strong>Tracking code:</strong> ${safeApplication.trackingCode}</p>
          <p><strong>Destination country:</strong> ${safeApplication.destinationCountry}</p>
          <p><strong>Application status:</strong> ${safeApplication.status}</p>
          <p><a href="${safeApplication.trackingUrl}" style="color: #0b4ea2; font-weight: bold;">Open tracking page</a></p>
        </div>
      `,
    });
  } catch (error) {
    console.warn("Admin notification email failed:", error);
  }
}
