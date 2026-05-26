export type OtpEmailVariant = 'register' | 'password_reset'

type OtpEmailContent = {
  otp: string
  variant: OtpEmailVariant
  frontendUrl: string
  recipientEmail: string
}

const COLORS = {
  pageBg: '#0a0705',
  cardBg: '#110c09',
  cardBorder: '#b45309',
  amber400: '#fbbf24',
  amber500: '#f59e0b',
  textPrimary: '#f5f5f4',
  textMuted: '#a8a29e',
  textDark: '#1a1208',
}

function copy(variant: OtpEmailVariant) {
  if (variant === 'register') {
    return {
      subject: 'Verify your Recipe Hub account',
      preheader: 'Your verification code is ready',
      title: 'Welcome to Recipe Hub',
      subtitle: 'Use this code to verify your email and complete registration.',
      ctaLabel: 'Enter verification code',
      ctaPath: '/verify-otp',
    }
  }

  return {
    subject: 'Reset your Recipe Hub password',
    preheader: 'Your password reset code is ready',
    title: 'Password reset',
    subtitle:
      'Use this code to reset your password. If you did not request this, you can ignore this email.',
    ctaLabel: 'Continue reset',
    ctaPath: '/verify-otp',
  }
}

export function buildOtpEmail({ otp, variant, frontendUrl, recipientEmail }: OtpEmailContent) {
  const content = copy(variant)
  const actionUrl = `${frontendUrl.replace(/\/$/, '')}${content.ctaPath}`
  const year = new Date().getFullYear()

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${content.subject}</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.pageBg};font-family:Georgia,'Times New Roman',serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${content.preheader}: ${otp}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:radial-gradient(circle at 30% 10%, #1f160e, ${COLORS.pageBg});padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <p style="margin:0;font-family:'Brush Script MT','Segoe Script',cursive;font-size:36px;line-height:1.2;color:${COLORS.amber400};">
                Recipe Hub
              </p>
              <p style="margin:8px 0 0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:${COLORS.textMuted};font-family:Arial,Helvetica,sans-serif;">
                Discover · Cook · Share
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:${COLORS.cardBg};border:1px solid ${COLORS.cardBorder};border-radius:16px;padding:32px 28px;box-shadow:0 20px 50px rgba(0,0,0,0.45);">
              <h1 style="margin:0 0 12px;font-size:28px;line-height:1.25;color:${COLORS.textPrimary};font-weight:700;">
                ${content.title}
              </h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:${COLORS.textMuted};font-family:Arial,Helvetica,sans-serif;">
                ${content.subtitle}
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center" style="background:linear-gradient(135deg, #1a1208 0%, #0d0906 100%);border:1px dashed ${COLORS.amber500};border-radius:12px;padding:22px 16px;">
                    <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${COLORS.amber400};font-family:Arial,Helvetica,sans-serif;">
                      Your verification code
                    </p>
                    <p style="margin:0;font-size:40px;line-height:1;letter-spacing:0.35em;font-weight:700;color:${COLORS.amber500};font-family:'Courier New',Courier,monospace;">
                      ${otp}
                    </p>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto 20px;">
                <tr>
                  <td align="center" style="border-radius:999px;background-color:${COLORS.amber500};">
                    <a href="${actionUrl}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;color:${COLORS.textDark};font-family:Arial,Helvetica,sans-serif;">
                      ${content.ctaLabel}
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:13px;line-height:1.6;color:${COLORS.textMuted};font-family:Arial,Helvetica,sans-serif;text-align:center;">
                This code expires in <strong style="color:${COLORS.amber400};">10 minutes</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 8px 0;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;line-height:1.5;color:${COLORS.textMuted};font-family:Arial,Helvetica,sans-serif;">
                Sent to <span style="color:${COLORS.amber400};">${recipientEmail}</span>
              </p>
              <p style="margin:0;font-size:11px;color:#78716c;font-family:Arial,Helvetica,sans-serif;">
                &copy; ${year} Recipe Hub &middot; Made with care for home cooks
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `${content.title}

${content.subtitle}

Your verification code: ${otp}

This code expires in 10 minutes.

Continue here: ${actionUrl}

— Recipe Hub`

  return {
    subject: content.subject,
    html,
    text,
  }
}
