declare module 'zeptomail' {
  export interface EmailAddress {
    address: string
    name?: string
  }

  export interface ToRecipient {
    email_address: EmailAddress
  }

  export interface SendMailParams {
    from: EmailAddress
    to: ToRecipient[]
    subject: string
    htmlbody?: string
    textbody?: string
  }

  export interface SendMailResponse {
    data?: {
      message_id?: string
    }
    error?: {
      message?: string
    }
  }

  export class SendMailClient {
    constructor(config: { url: string; token: string })
    sendMail(params: SendMailParams): Promise<SendMailResponse>
  }
}