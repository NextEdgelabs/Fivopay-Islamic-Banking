
"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  BanknotesIcon,
  DocumentTextIcon,
  CogIcon
} from "@heroicons/react/24/outline";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  type: z.enum(['Personal', 'Business', 'Home', 'Vehicle', 'Education']),
  minAmount: z.string().min(1, "Valid minimum amount is required"),
  maxAmount: z.string().min(1, "Valid maximum amount is required"),
  profitRate: z.string().optional(),
  tenure: z.string().min(1, "Tenure is required"),
  description: z.string().min(1, "Description is required"),
  loanStructure: z.enum(['Term Loan', 'Credit Line', 'Installment Loan', 'Secured Loan', 'Unsecured Loan']),
  profitSharingRatio: z.string().optional(),
  minAge: z.string().optional(),
  maxAge: z.string().optional(),
  minIncome: z.string().optional(),
  employmentType: z.array(z.string()).optional(),
  creditScore: z.string().optional(),
  requiredDocuments: z.array(z.string()).optional(),
  processingFee: z.string().optional(),
  prepaymentCharges: z.string().optional(),
  latePaymentPenalty: z.string().optional(),
  status: z.enum(['Draft', 'Active', 'Inactive']),
}).refine(data => parseFloat(data.maxAmount) > parseFloat(data.minAmount), {
  message: "Maximum amount must be greater than minimum",
  path: ["maxAmount"],
});

type ProductFormData = z.infer<typeof productSchema>;

export default function CreateProductPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      minAmount: '',
      maxAmount: '',
      profitRate: '',
      tenure: '',
      description: '',
      profitSharingRatio: '',
      minAge: '18',
      maxAge: '65',
      minIncome: '',
      employmentType: [],
      creditScore: '',
      requiredDocuments: [],
      processingFee: '',
      prepaymentCharges: '',
      latePaymentPenalty: '',
      status: 'Draft'
    }
  });

  const productTypes = [
    { value: 'Personal', label: 'Personal Financing', description: 'Individual consumer financing' },
    { value: 'Business', label: 'Business Financing', description: 'Commercial and SME financing' },
    { value: 'Home', label: 'Home Financing', description: 'Residential property purchase' },
    { value: 'Vehicle', label: 'Vehicle Financing', description: 'Auto and vehicle purchase' },
    { value: 'Education', label: 'Education Financing', description: 'Educational expenses and fees' }
  ];

  const loanStructures = [
    { value: 'Term Loan', label: 'Term Loan', description: 'Fixed-term installment loan' },
    { value: 'Credit Line', label: 'Credit Line', description: 'Revolving credit facility' },
    { value: 'Installment Loan', label: 'Installment Loan', description: 'Equal monthly installments' },
    { value: 'Secured Loan', label: 'Secured Loan', description: 'Collateral-backed financing' },
    { value: 'Unsecured Loan', label: 'Unsecured Loan', description: 'Credit-based financing' }
  ];

  const employmentTypes = [
    'Salaried Employee',
    'Self Employed',
    'Business Owner',
    'Professional',
    'Government Employee',
    'Retired'
  ];

  const documentOptions = [
    'PAN Card',
    'Aadhar Card',
    'Income Tax Returns',
    'Salary Slips',
    'Bank Statements',
    'Property Documents',
    'Business Registration',
    'Financial Statements',
    'Employment Certificate',
    'Address Proof'
  ];

  const onSubmit = async (data: ProductFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Creating product:', data);
      alert('Product created successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/loans/products"
          className="text-dark-light hover:text-dark"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-dark">Create New Product</h1>
          <p className="text-dark-light">Create a new loan product</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-light shadow-md rounded-lg p-6 border border-secondary-dark">
          <div className="flex items-center space-x-2 mb-6">
            <BanknotesIcon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-dark">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark-light mb-2">Product Name *</label>
              <input
                type="text"
                {...register("name")}
                className={`w-full px-4 py-2 border rounded-md text-dark focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.name ? 'border-danger' : 'border-secondary-dark'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-light mb-2">Product Type *</label>
              <select
                {...register("type")}
                className={`w-full px-4 py-2 border rounded-md text-dark focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.type ? 'border-danger' : 'border-secondary-dark'
                }`}
              >
                <option value="">Select product type</option>
                {productTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.type && <p className="text-danger text-xs mt-1">{errors.type.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-light mb-2">Minimum Amount (₹) *</label>
              <input
                type="number"
                {...register("minAmount")}
                className={`w-full px-4 py-2 border rounded-md text-dark focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.minAmount ? 'border-danger' : 'border-secondary-dark'
                }`}
                placeholder="50000"
              />
              {errors.minAmount && <p className="text-danger text-xs mt-1">{errors.minAmount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-light mb-2">Maximum Amount (₹) *</label>
              <input
                type="number"
                {...register("maxAmount")}
                className={`w-full px-4 py-2 border rounded-md text-dark focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.maxAmount ? 'border-danger' : 'border-secondary-dark'
                }`}
                placeholder="1000000"
              />
              {errors.maxAmount && <p className="text-danger text-xs mt-1">{errors.maxAmount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-light mb-2">Tenure</label>
              <input
                type="text"
                {...register("tenure")}
                className="w-full px-4 py-2 border border-secondary-dark rounded-md text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., 6-36 months"
              />
              {errors.tenure && <p className="text-danger text-xs mt-1">{errors.tenure.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-light mb-2">Status</label>
              <select
                {...register("status")}
                className="w-full px-4 py-2 border border-secondary-dark rounded-md text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-dark-light mb-2">Description *</label>
            <textarea
              {...register("description")}
              rows={3}
              className={`w-full px-4 py-2 border rounded-md text-dark focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.description ? 'border-danger' : 'border-secondary-dark'
              }`}
              placeholder="Describe the loan product features and benefits"
            />
            {errors.description && <p className="text-danger text-xs mt-1">{errors.description.message}</p>}
          </div>
        </div>

        {/* Banking Configuration */}
        <div className="bg-light shadow-md rounded-lg p-6 border border-secondary-dark">
          <div className="flex items-center space-x-2 mb-6">
            <DocumentTextIcon className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold text-dark">Banking Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark-light mb-2">Loan Structure *</label>
              <select
                {...register("loanStructure")}
                className={`w-full px-4 py-2 border rounded-md text-dark focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.loanStructure ? 'border-danger' : 'border-secondary-dark'
                }`}
              >
                <option value="">Select loan structure</option>
                {loanStructures.map((structure) => (
                  <option key={structure.value} value={structure.value}>{structure.label}</option>
                ))}
              </select>
              {errors.loanStructure && <p className="text-danger text-xs mt-1">{errors.loanStructure.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-light mb-2">Profit Rate (%)</label>
              <input
                type="number"
                step="0.01"
                {...register("profitRate")}
                className="w-full px-4 py-2 border border-secondary-dark rounded-md text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0.00"
              />
              <p className="text-xs text-dark-light mt-1">Leave blank for profit-sharing products</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-light mb-2">Profit Sharing Ratio (%)</label>
              <input
                type="number"
                {...register("profitSharingRatio")}
                className="w-full px-4 py-2 border border-secondary-dark rounded-md text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="60"
              />
              <p className="text-xs text-dark-light mt-1">For partnership-based products</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-accent">Regulatory Compliance</h4>
                <p className="text-sm text-accent/80 mt-1">
                  This product will be reviewed by our Compliance Board to ensure full regulatory 
                  compliance before activation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="bg-light shadow-md rounded-lg p-6 border border-secondary-dark">
          <div className="flex items-center space-x-2 mb-6">
            <CogIcon className="h-5 w-5 text-info" />
            <h2 className="text-lg font-semibold text-dark">Eligibility Criteria</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark-light mb-2">Minimum Age</label>
              <input
                type="number"
                {...register("minAge")}
                className="w-full px-4 py-2 border border-secondary-dark rounded-md text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="18"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-light mb-2">Maximum Age</label>
              <input
                type="number"
                {...register("maxAge")}
                className="w-full px-4 py-2 border border-secondary-dark rounded-md text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="65"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-light mb-2">Minimum Income (₹)</label>
              <input
                type="number"
                {...register("minIncome")}
                className="w-full px-4 py-2 border border-secondary-dark rounded-md text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="25000"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-dark-light mb-3">Employment Types</label>
            <Controller
              name="employmentType"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {employmentTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.value?.includes(type)}
                        onChange={() => {
                          const newValue = field.value?.includes(type)
                            ? field.value.filter((item) => item !== type)
                            : [...(field.value || []), type];
                          field.onChange(newValue);
                        }}
                        className="rounded border-secondary-dark text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-dark-light">{type}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-dark-light mb-3">Required Documents</label>
            <Controller
              name="requiredDocuments"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {documentOptions.map((doc) => (
                    <label key={doc} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.value?.includes(doc)}
                        onChange={() => {
                          const newValue = field.value?.includes(doc)
                            ? field.value.filter((item) => item !== doc)
                            : [...(field.value || []), doc];
                          field.onChange(newValue);
                        }}
                        className="rounded border-secondary-dark text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-dark-light">{doc}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-light shadow-md rounded-lg p-6 border border-secondary-dark">
          <h2 className="text-lg font-semibold text-dark mb-6">Terms and Conditions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark-light mb-2">Processing Fee (%)</label>
              <input
                type="number"
                step="0.01"
                {...register("processingFee")}
                className="w-full px-4 py-2 border border-secondary-dark rounded-md text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="1.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-light mb-2">Prepayment Charges (%)</label>
              <input
                type="number"
                step="0.01"
                {...register("prepaymentCharges")}
                className="w-full px-4 py-2 border border-secondary-dark rounded-md text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="2.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-light mb-2">Late Payment Penalty (%)</label>
              <input
                type="number"
                step="0.01"
                {...register("latePaymentPenalty")}
                className="w-full px-4 py-2 border border-secondary-dark rounded-md text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0.50"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end items-center">
          <Link
            href="/dashboard/loans/products"
            className="bg-secondary text-dark px-6 py-2 rounded-md hover:bg-secondary-dark transition-colors mr-3"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-4 w-4" />
                <span>Create Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 