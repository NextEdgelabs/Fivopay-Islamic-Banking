import { getModelForClass, modelOptions, mongoose, prop } from "@typegoose/typegoose";

export enum ShareTransactionType {
  Purchase = "purchase",
  Sell = "sell",
}

export enum ShareTransactionStatus {
  Pending = "Pending",
  Verified = "Verified",
  Rejected = "Rejected",
  Completed = "Completed",
}

@modelOptions({ schemaOptions: { timestamps: true, collection: "shareTransactions" } })
export class ShareTransaction {
  // Customer/User Reference
  @prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
  public customerId!: mongoose.Schema.Types.ObjectId;

  // Agent (Employee) Reference
  @prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Employee" })
  public agentId!: mongoose.Schema.Types.ObjectId;

  // Transaction Type
  @prop({ enum: ShareTransactionType, required: true })
  public transactionType!: ShareTransactionType;

  // Share Details
  @prop({ required: true, min: 1 })
  public quantity!: number; // Number of shares

  @prop({ required: true, min: 0 })
  public pricePerShare!: number; // Price per share at time of transaction

  @prop({ required: true, min: 0 })
  public totalAmount!: number; // Total amount (quantity * pricePerShare)

  // Transaction Status
  @prop({ enum: ShareTransactionStatus, default: ShareTransactionStatus.Pending })
  public status!: ShareTransactionStatus;

  // Razorpay Payment Fields
  @prop({ trim: true })
  public razorpayOrderId?: string;

  @prop({ trim: true })
  public razorpayPaymentId?: string;

  @prop({ trim: true })
  public razorpaySignature?: string;

  @prop({ trim: true, default: "razorpay" })
  public paymentMethod!: string; // razorpay, cash, bank_transfer, etc.

  @prop({ trim: true, default: "pending" })
  public paymentStatus!: string; // pending, captured, failed, cancelled

  @prop({ type: Object })
  public razorpayResponse?: any; // Razorpay payment response

  @prop({ type: Object })
  public webhookData?: any; // Razorpay webhook data

  // Transaction ID for tracking
  @prop({ trim: true, unique: true })
  public transactionId?: string; // Unique transaction ID

  // Verification Details
  @prop({ type: mongoose.Schema.Types.ObjectId, ref: "Employee" })
  public verifiedBy?: mongoose.Schema.Types.ObjectId;

  @prop({ type: Date })
  public verifiedAt?: Date;

  @prop({ trim: true })
  public rejectionReason?: string;

  @prop({ type: Date })
  public completedAt?: Date;

  // System Fields
  @prop({ default: false })
  public isDeleted?: boolean;

  @prop({ default: true })
  public isActive!: boolean;
}

export const ShareTransactionModel = getModelForClass(ShareTransaction);



// GET /api/v1/share-transaction/get-all-transactions?page=1&limit=10&customerId=xxx&agentId=xxx&transactionType=purchase&status=Verified&startDate=2024-01-01&endDate=2024-12-31
