// import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

// enum Department {
//   Sales = "Sales",
//   Engineering = "Engineering",
//   Installation = "Installation",
//   Maintenance = "Maintenance",
//   Administration = "Administration",
//   Finance = "Finance",
//   HumanResources = "Human Resources",
//   QualityControl = "Quality Control",
//   Procurement = "Procurement",
//   CustomerService = "Customer Service",
//   Internal = "Internal",
//   Order = "Order",
// }

// enum Designation {
//   SalesManager = "Sales Manager",
//   SalesExecutive = "Sales Executive",
//   SeniorEngineer = "Senior Engineer",
//   ElectricalEngineer = "Electrical Engineer",
//   InstallationTechnician = "Installation Technician",
//   MaintenanceTechnician = "Maintenance Technician",
//   ProjectManager = "Project Manager",
//   SiteSupervisor = "Site Supervisor",
//   QualityInspector = "Quality Inspector",
//   ProcurementOfficer = "Procurement Officer",
//   Accountant = "Accountant",
//   HRManager = "HR Manager",
//   AdministrativeAssistant = "Administrative Assistant",
//   CustomerServiceRepresentative = "Customer Service Representative",
//   InternalManager = "Internal Manager",
//   OrderManager = "Order Manager",
// }
// @modelOptions({ schemaOptions: { timestamps: true } })
// export class Employee {
//   @prop({ required: true, trim: true })
//   public employeeId!: string;

//   @prop({ required: true, trim: true })
//   public firstName!: string;

//   @prop({ trim: true })
//   public lastName?: string;

//   @prop({ required: true, lowercase: true, trim: true })
//   public email!: string;

//   @prop({ trim: true })
//   public password?: string;

//   @prop({ required: true, trim: true })
//   public phone!: string;

//   @prop({ trim: true })
//   public mobile?: string;

//   @prop({
//     required: true,
//     default: "Active",
//     enum: ["Active", "Inactive", "Terminated"],
//   })
//   public status!: string;

//   @prop({
//     required: true,
//     enum: ["Full Time", "Part Time", "Contract", "Intern"],
//   })
//   public employmentType!: string;

//   @prop({ trim: true })
//   public moduleAccess?: string[];

//   @prop({ required: true })
//   public dateOfBirth!: Date;

//   @prop({ required: true })
//   public dateOfJoining!: Date;

//   @prop({ default: false })
//   public isDeleted!: boolean;

//   @prop({ default: true })
//   public isActive!: boolean;

//   @prop({ trim: true })
//   public accessList?: string[];

//   @prop({ required: true, enum: Department })
//   public department!: Department;

//   @prop({ required: true, enum: Designation })
//   public designation!: Designation;

//   @prop({ trim: true })
//   public reportingTo?: string;

//   @prop({ required: true, trim: true })
//   public address!: string;

//   @prop({ required: true, trim: true })
//   public city!: string;

//   @prop({ required: true, trim: true })
//   public state!: string;

//   @prop({ required: true, trim: true })
//   public zipCode!: string;

//   @prop({ required: true, trim: true })
//   public contactName!: string;

//   @prop({ required: true, trim: true })
//   public relationship!: string;

//   @prop({ required: true, trim: true })
//   public contactPhone!: string;

//   @prop({ type: () => [String], default: [] })
//   public skills!: string[];

//   @prop({ type: () => [String], default: [] })
//   public certifications!: string[];

//   @prop({ type: () => [String], default: [] })
//   public responsibilities!: string[];
// }

// export const EmployeeModel = getModelForClass(Employee);