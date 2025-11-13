// Recovery Notice Types
export enum NoticeType {
  FIRST_NOTICE = 'First Notice',
  SECOND_REMINDER = 'Second Reminder',
  LEGAL_NOTICE = 'Legal Notice',
  NPA_CONVERSION = 'NPA Conversion',
}

// Recovery Status
export enum RecoveryStatus {
  PENDING = 'Pending',
  NOTICE_ISSUED = 'Notice Issued',
  NOTICE_APPROVED = 'Notice Approved',
  NOTICE_SENT = 'Notice Sent',
  PARTIAL_PAYMENT = 'Partial Payment',
  SETTLED = 'Settled',
  NPA = 'NPA',
}

// Notice Delivery Method
export enum DeliveryMethod {
  EMAIL = 'Email',
  WHATSAPP = 'WhatsApp',
  PHYSICAL = 'Physical Copy',
}

// Recovery Due Interface
export interface RecoveryDue {
  id: string;
  loanId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  principalAmount: number;
  interestAmount: number;
  penaltyAmount: number;
  totalDue: number;
  dueDate: Date;
  daysOverdue: number;
  status: RecoveryStatus;
  noticeType?: NoticeType;
  noticeIssuedDate?: Date;
  noticeApprovedDate?: Date;
  noticeSentDate?: Date;
  deliveryMethod?: DeliveryMethod;
  lastPaymentDate?: Date;
  lastPaymentAmount?: number;
  nextNoticeDate?: Date;
  isNPA: boolean;
  npaDate?: Date;
  remarks?: string;
}

