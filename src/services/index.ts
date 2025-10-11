// Services index file for easy imports
export { CustomerService, CustomerCache } from './customer.service';

// Re-export types for convenience
export type {
  Customer,
  CustomerKYC,
  CustomerDocument,
  CustomerAddress,
  CustomerNominee,
  CustomerAccount,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerSearchFilters,
  CustomerListResponse,
  CustomerStats,
  CustomerType,
  CustomerStatus,
  KYCStatus,
  RiskRating
} from '../types/customer';
