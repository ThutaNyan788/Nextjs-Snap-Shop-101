"use server"
import EmailTemplate from '@/components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailProps = {
    name: string ;
    token: string;
    email: string ;
}

export const sendEmail =  async ({name,token,email}:EmailProps) => {

  const resetPasswordLink = `${process.env.NEXTAUTH_URL}/auth/confirm-email?token=${token}`;


  const { data, error } = await resend.emails.send({
    from: 'SnapShop <onboarding@resend.dev>',
    to: email,
    subject: 'Email Verification',
    react: EmailTemplate({ name, resetPasswordLink }),
  });

  if (error) {
    return {
        error:"Something went wrong",
    };
  }

  return {
    data,
    success:"Email sent successfully",
  }
};