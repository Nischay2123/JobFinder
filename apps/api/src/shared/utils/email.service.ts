import nodemailer from 'nodemailer';
import { config } from '../../config';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${config.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: `"JobFinder" <${config.GMAIL_USER}>`,
      to: email,
      subject: 'Verify your email for JobFinder',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2>Welcome to JobFinder!</h2>
          <p>Please click the button below to verify your email and complete your registration.</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p>Or copy and paste this link into your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 15 minutes.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send verification email');
    }
  }
}

export const emailService = new EmailService();
