import { sendEmail } from "../../lib/sendEmail";

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return Response.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const html = `
      <div style="font-family:sans-serif;font-size:14px;color:#0a1f14;">
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject || "—")}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
      </div>
    `;

    await sendEmail({
      to: process.env.CONTACT_TO_EMAIL || process.env.EMAIL_USER,
      subject: subject ? `Contact form Aucville : message from ${name}: ${subject}` : `New contact form message from ${name}`,
      html,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact form send error:", err);
    return Response.json(
      { success: false, error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

// minimal HTML escaping so user input can't break the email markup
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}