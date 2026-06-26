import nodemailer from "nodemailer";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function createTransportFromEnv() {
  const host = requireEnv("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT || 587);
  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASS");
  const from = requireEnv("SMTP_FROM");
  const tls = process.env.SMTP_TLS === "false" ? false : true;

  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: tls ? { rejectUnauthorized: false } : undefined,
    }),
    from,
  };
}

export async function sendEmail({ to, subject, text, html }) {
  if (!to) throw new Error("Missing `to`");
  const { transporter, from } = createTransportFromEnv();

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return info;
}

