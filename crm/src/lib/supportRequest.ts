export interface SupportRequestInput {
  orderId?: string;
  customerEmail?: string;
  discordHandle?: string;
  subject?: string;
  initialMessage?: string;
}

export function parseSupportRequest(input: Record<string, unknown>): Required<Pick<SupportRequestInput, 'customerEmail' | 'subject' | 'initialMessage'>> & Pick<SupportRequestInput, 'orderId' | 'discordHandle'> {
  const customerEmail = typeof input.customerEmail === 'string' ? input.customerEmail.trim() : '';
  const subject = typeof input.subject === 'string' ? input.subject.trim() : '';
  const initialMessage = typeof input.initialMessage === 'string' ? input.initialMessage.trim() : '';

  if (!customerEmail || !subject || !initialMessage) {
    throw new Error('Email, subject, and message are required.');
  }

  return {
    ...(typeof input.orderId === 'string' && input.orderId ? { orderId: input.orderId } : {}),
    customerEmail,
    ...(typeof input.discordHandle === 'string' && input.discordHandle ? { discordHandle: input.discordHandle } : {}),
    subject,
    initialMessage,
  };
}
