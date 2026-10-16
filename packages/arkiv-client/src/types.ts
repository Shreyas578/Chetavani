export type ScamCategory =
  | 'kyc'
  | 'loan_app'
  | 'job'
  | 'digital_arrest'
  | 'upi'
  | 'other';

export type IndicatorKind = 'domain' | 'app' | 'template' | 'upi';

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn';

export type ReportStatus = 'unconfirmed' | 'confirmed' | 'disputed';

export interface ReportPayload {
  title: string;
  description: string;
  sampleTemplate?: string;
  createdAt: number;
  reporter?: string;
  tags?: string[];
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface DisputePayload {
  reason: string;
  proofUrl?: string;
  timestamp: number;
  disputer: string;
}

export interface ChetavaniReport {
  key: string;
  kind: IndicatorKind;
  indicator: string;
  category: ScamCategory;
  lang: SupportedLanguage;
  status: ReportStatus;
  confirms: number;
  payload: ReportPayload;
  expiresAtBlock?: bigint | number;
  owner?: string;
  disputeReason?: string;
  disputedBy?: string;
}

export interface ConfirmRecord {
  key: string;
  reportKey: string;
  confirmer: string;
  timestamp: number;
}
