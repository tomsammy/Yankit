import { supabase } from '@/lib/supabaseClient';

const sendEmail = async ({ to, subject, html, text }) => {
  const { error } = await supabase.functions.invoke('send-email', {
    body: {
      to,
      subject,
      html,
      text,
    },
  });

  if (error) {
    console.error('Email send failed:', error);
    throw new Error('Failed to send notification email');
  }
};

export const notifyPaymentSuccess = async ({ to }) => {
  return sendEmail({
    to,
    subject: 'Payment Successful',
    html: `
      <h2>Payment Successful</h2>
      <p>Your payment has been received successfully.</p>
      <p>You can now track your shipment from your dashboard.</p>
      <p><strong>Thank you for using YankIt.</strong></p>
    `,
  });
};

export const notifyYankerMatched = async ({ to }) => {
  return sendEmail({
    to,
    subject: 'Your Shipment Has Been Matched',
    html: `
      <h2>Good news 🎉</h2>
      <p>Your shipment has been matched with a Yanker.</p>
      <p>Please proceed to payment to confirm and move forward.</p>
      <p><strong>Open your dashboard to continue.</strong></p>
    `,
  });
};

export const notifyNewActivityCTA = async ({ to }) => {
  return sendEmail({
    to,
    subject: 'New Activity on YankIt',
    html: `
      <h2>Something new is happening 🚀</h2>
      <p>New shipments and yankings are being created on YankIt.</p>
      <p>Open the app to explore opportunities or create your own.</p>
      <p><strong>Don’t miss out.</strong></p>
    `,
  });
};
