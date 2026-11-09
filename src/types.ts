export type PlatformCategory =
  | 'instagram'
  | 'whatsapp'
  | 'facebook'
  | 'gmail'
  | 'snapchat';

export type PaymentStatus =
  | 'Awaiting Payment'
  | 'Payment Incomplete'
  | 'Verification Pending'
  | 'Payment Verified'
  | 'Payment Rejected';

export type RequestStatus =
  | 'Request Received'
  | 'Payment Verification'
  | 'Under Review'
  | 'Assistance in Progress'
  | 'Completed'
  | 'Cancelled';

export interface ServiceItem {
  id: string;
  title: string;
  platform: PlatformCategory;
  description: string;
  price: number;
  currency: string;
  inputLabel: string;
  inputPlaceholder: string;
  isMobileNumber?: boolean;
}

export interface CustomerRequest {
  id: string; // e.g. VK-7294-SEC
  serviceId: string;
  serviceTitle: string;
  platform: PlatformCategory;
  usernameOrNumber: string;
  inputFieldLabel: string;
  price: number;
  currency: string;
  amountPaid?: number; // Customer entered transferred amount
  remainingAmount?: number; // Calculated remaining balance if underpaid
  excessAmount?: number; // Calculated excess amount if overpaid
  utrNumber?: string;
  receiptImage?: string;
  paymentStatus: PaymentStatus;
  requestStatus: RequestStatus;
  submissionDate: string;
  lastUpdatedDate: string;
  adminRemarks?: string;
}

export interface AdminSettings {
  adminPin: string;
  whatsappNumber: string;
  upiId: string;
  upiQrNote: string;
  qrCodeUrl?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}
