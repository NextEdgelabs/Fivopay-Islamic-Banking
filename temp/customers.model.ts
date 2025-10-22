
// // READ - Get all customers with pagination and filtering
// export const getAllCustomers = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const page = parseInt(req.query.page as string) || 1;
//       const limit = parseInt(req.query.limit as string) || 10;
//       const skip = (page - 1) * limit;
  
//       // Filter options
//       const filter: any = {};
//       if (req.query.kycStatus) filter.kycStatus = req.query.kycStatus;
//       if (req.query.accountType) filter.accountType = req.query.accountType;
//       if (req.query.city) filter.city = new RegExp(req.query.city as string, "i");
//       if (req.query.state)
//         filter.state = new RegExp(req.query.state as string, "i");
  
//       const users = await UserModel.find(filter)
//         .skip(skip)
//         .limit(limit)
//         .sort({ createdAt: -1 });
  
//       const totalUsers = await UserModel.countDocuments(filter);
//       const totalPages = Math.ceil(totalUsers / limit);
  
//       res.status(200).json({
//         success: true,
//         message: "Users retrieved successfully",
//         data: {
//           users,
//           pagination: {
//             currentPage: page,
//             totalPages,
//             totalUsers,
//             hasNextPage: page < totalPages,
//             hasPrevPage: page > 1,
//           },
//         },
//       });
//     } catch (error: any) {
//       res.status(500).json({
//         success: false,
//         message: "Error retrieving customers",
//         error: error.message,
//       });
//     }
//   };
  
//   // READ - Get customer by ID
//   export const getCustomerById = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const { id } = req.params;
  
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid customer ID format",
//         });
//       }
  
//       const user = await UserModel.findById(id);
  
//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }
  
//       res.status(200).json({
//         success: true,
//         message: "User retrieved successfully",
//         data: user,
//       });
//     } catch (error: any) {
//       res.status(500).json({
//         success: false,
//         message: "Error retrieving user: " + error,
//         error: error.message,
//       });
//     }
//   };
//   import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

//   enum Gender {
//     Male = "Male",
//     Female = "Female",
//     Other = "Other",
//   }
  
//   enum MaritalStatus {
//     Single = "Single",
//     Married = "Married",
//     Divorced = "Divorced",
//     Widowed = "Widowed",
//   }
  
//   enum AccountType {
//     Savings = "Savings",
//     Current = "Current",
//     Business = "Business",
//   }
  
//   export enum KycStatus {
//     Pending = "Pending",
//     InProgress = "In Progress",
//     Verified = "Verified",
//     Rejected = "Rejected",
//   }
  
//   enum AddressProofType {
//     UtilityBill = "Utility Bill",
//     BankStatement = "Bank Statement",
//     RentAgreement = "Rent Agreement",
//     PropertyTaxReceipt = "Property Tax Receipt",
//   }
  
//   @modelOptions({ schemaOptions: { timestamps: true, collection: "users" } })
//   export class User {
  
//     @prop()
//     public memberId!: string;
//     // Primary Details
//     @prop({ trim: true, minlength: 3 })
//     public fullName!: string;
  
//     @prop({ lowercase: true, trim: true, match: /\S+@\S+\.\S+/ })
//     public email!: string;
  
//     @prop({ trim: true })
//     public phone!: string;
  
//     @prop({ trim: true })
//     public alternatePhone?: string;
  
//     @prop()
//     public dateOfBirth!: Date; // stored as Date in DB
  
//     @prop({ enum: Gender })
//     public gender!: Gender;
  
//     @prop({ enum: MaritalStatus })
//     public maritalStatus?: MaritalStatus;
  
//     @prop({ trim: true })
//     public fatherName?: string;
  
//     @prop({ trim: true })
//     public motherName?: string;
  
//     @prop({ trim: true })
//     public occupation!: string;
  
//     @prop({ min: 0 })
//     public annualIncome?: number;
  
//     // Address Information
//     @prop({ trim: true })
//     public addressLine1!: string;
  
//     @prop({ trim: true })
//     public addressLine2?: string;
  
//     @prop({ trim: true })
//     public city!: string;
  
//     @prop({ trim: true })
//     public state!: string;
  
//     @prop({ trim: true, match: /^\d{6}$/ })
//     public postalCode!: string; // Indian PIN code
  
//     @prop({ trim: true, default: "India" })
//     public country!: string;
  
//     // Account Information
//     @prop({ enum: AccountType })
//     public accountType!: AccountType;
  
//     @prop({ min: 1000 })
//     public initialDeposit!: number; // Minimum ₹1,000
  
//     @prop({ trim: true })
//     public branch!: string;
  
//     // Nominee (Optional)
//     @prop({ trim: true })
//     public nomineeName?: string;
  
//     @prop({ trim: true })
//     public nomineeRelation?: string;
  
//     @prop({ trim: true })
//     public nomineePhone?: string;
  
//     @prop({ trim: true })
//     public nomineeAddress?: string;
  
//     // KYC Details
//     @prop({ match: /^\d{12}$/ })
//     public aadhaarNumber?: string; // 12 digits
  
//     @prop()
//     public aadharVerificationStatus?: boolean;
  
//     @prop({ match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/ })
//     public panNumber?: string; // ABCDE1234F
  
//     @prop()
//     public panVerificationStatus?: boolean;
  
//     @prop({ trim: true })
//     public passportNumber?: string;
  
//     @prop({ trim: true })
//     public drivingLicenseNumber?: string;
  
//     @prop({ trim: true })
//     public voterIdNumber?: string;
  
//     @prop({ enum: AddressProofType })
//     public addressProofType?: AddressProofType;
  
//     @prop({ trim: true })
//     public addressProofNumber?: string;
  
//     @prop({ enum: KycStatus, default: KycStatus.Pending })
//     public kycStatus!: KycStatus;
  
//     @prop({ trim: true })
//     public kycNotes?: string;
//   }
  
//   export const UserModel = getModelForClass(User);  

//   import { Router } from "express";
// // import { saveAadhar, savePan, getMemberId } from "./user.additional.controller";
// import { createCustomer, createProfile, createUser, getUserById, getUserByEmail, getAllUsers, resendOTPtoUser, saveAadhar, savePanCardDetails, seupdateUser, ndOTPtoUser, userLogin, verifyOTPofUser, updateUser } from "./user.controller";

// const userRoutes = Router();

// // /api/user/save-aadhar
// // userRoutes.post("/save-aadhar", saveAadhar);

// // // /api/user/save-pan   
// // userRoutes.post("/save-pan", savePan);

// // // /api/user/get-member-id
// // userRoutes.post("/get-member-id", getMemberId);

// // /api/v1/user/send-otp
// userRoutes.post("/send-otp", sendOTPtoUser);

// // /api/v1/user/resend-otp
// userRoutes.post("/resend-otp", resendOTPtoUser);

// // /api/v1/user/verify-otp
// userRoutes.post("/verify-otp", verifyOTPofUser);

// // /api/v1/user/create-profile
// userRoutes.post("/create-profile", createProfile);

// // /api/v1/user/save-pan-card-details
// userRoutes.post("/save-pan-card-details", savePanCardDetails);

// // /api/v1/user/save-aadhar
// userRoutes.post("/save-aadhar", saveAadhar);

// // /api/v1/user/user-login
// userRoutes.post("/user-login", userLogin);

// // /api/v1/user/create-user
// userRoutes.post("/create-user", createUser);

// // /api/v1/user/get-all-users
// userRoutes.get("/get-all-users", getAllUsers);

// // /api/v1/user/get-user-by-id
// userRoutes.get("/get-user-by-id", getUserById);

// // /api/v1/user/update-user
// userRoutes.put("/update-user", updateUser);

// // /api/v1/user/delete-user
// export default userRoutes;