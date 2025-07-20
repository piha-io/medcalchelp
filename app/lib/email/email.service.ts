import { SendMailClient } from 'zeptomail'

const zeptoMailClient = new SendMailClient({
  url: process.env.ZEPTOMAIL_API_URL || 'https://api.zeptomail.com/',
  token: process.env.ZEPTOMAIL_TOKEN || ''
})

export interface SendVerificationCodeParams {
  email: string
  code: string
}

export async function sendVerificationCode({ email, code }: SendVerificationCodeParams) {
  if (!process.env.ZEPTOMAIL_TOKEN || process.env.ZEPTOMAIL_TOKEN === 'YOUR_ZEPTOMAIL_TOKEN_HERE') {
    console.warn('ZeptoMail token not configured. Verification code:', code)
    // In development, log the code instead of sending email
    if (process.env.NODE_ENV === 'development') {
      console.log(`
        ========================================
        Verification Code for ${email}: ${code}
        ========================================
      `)
      return { success: true, id: 'dev-mode' }
    }
    throw new Error('Email service not configured')
  }

  try {
    const response = await zeptoMailClient.sendMail({
      from: {
        address: process.env.FROM_EMAIL || 'noreply@learnmedmath.com',
        name: 'Learn Med Math'
      },
      to: [{
        email_address: {
          address: email
        }
      }],
      subject: 'Your Learn Med Math verification code',
      htmlbody: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Code</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .card {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .logo {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo h1 {
                color: #6366f1;
                font-size: 28px;
                margin: 0;
                font-weight: 700;
              }
              .code-box {
                background: #f3f4f6;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 30px 0;
              }
              .code {
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #6366f1;
                font-family: 'Courier New', monospace;
              }
              .message {
                color: #6b7280;
                font-size: 16px;
                margin-bottom: 20px;
              }
              .footer {
                text-align: center;
                color: #9ca3af;
                font-size: 14px;
                margin-top: 40px;
              }
              .footer a {
                color: #6366f1;
                text-decoration: none;
              }
              @media (max-width: 600px) {
                .card {
                  padding: 30px 20px;
                }
                .code {
                  font-size: 24px;
                  letter-spacing: 4px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <div class="logo">
                  <h1>Learn Med Math</h1>
                </div>
                
                <p class="message">
                  Hi there! Use the verification code below to sign in to your Learn Med Math account:
                </p>
                
                <div class="code-box">
                  <div class="code">${code}</div>
                </div>
                
                <p class="message">
                  This code will expire in 10 minutes. If you didn't request this code, you can safely ignore this email.
                </p>
                
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Learn Med Math. All rights reserved.</p>
                  <p>
                    Need help? <a href="${process.env.APP_URL || 'https://learnmedmath.com'}/support">Contact Support</a>
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      textbody: `Your Learn Med Math verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, you can safely ignore this email.`
    })

    if (!response || response.error) {
      console.error('Failed to send email:', response?.error)
      throw new Error(response?.error?.message || 'Failed to send email')
    }

    return { success: true, id: response.data?.message_id }
  } catch (error) {
    console.error('Email service error:', error)
    throw new Error('Failed to send verification email')
  }
}