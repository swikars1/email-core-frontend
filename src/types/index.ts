interface EmailAddress {
  name: string;
  address: string;
}

interface SenderRecipient {
  emailAddress: EmailAddress;
}

interface BodyContent {
  contentType: string;
  content: string;
}

interface Flag {
  flagStatus: string;
}

interface Email {
  "@odata.etag": string;
  id: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  changeKey: string;
  categories: string[];
  receivedDateTime: string;
  sentDateTime: string;
  hasAttachments: boolean;
  internetMessageId: string;
  subject: string;
  bodyPreview: string;
  importance: string;
  parentFolderId: string;
  conversationId: string;
  conversationIndex: string;
  isDeliveryReceiptRequested: boolean | null;
  isReadReceiptRequested: boolean;
  isRead: boolean;
  isDraft: boolean;
  webLink: string;
  inferenceClassification: string;
  body: BodyContent;
  sender: SenderRecipient;
  from: SenderRecipient;
  toRecipients: SenderRecipient[];
  ccRecipients: SenderRecipient[];
  bccRecipients: SenderRecipient[];
  replyTo: SenderRecipient[];
  flag: Flag;
}

interface ImportantEmailData {
  id: string;
  subject: string;
  fromName: string;
  fromAddress: string;
  receivedDateTime: string;
  bodyPreview: string;
  isRead: boolean;
}
