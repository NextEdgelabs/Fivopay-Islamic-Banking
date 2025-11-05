export const API = {
    domain: process.env.NEXT_PUBLIC_DOMAIN || "http://13.234.19.100:8080/",
  
    endPoints: {
        // Customer endpoints
        addCustomer: "/api/v1/user/create-user",
        getAllCustomers: "/api/v1/user/get-all-users",
        getCustomerById: "/api/v1/user/get-user-by-id",
        updateCustomer: "/api/v1/user/update-user",
        deleteCustomer: "/api/v1/user/delete-user",
        updateCustomerKyc: "/api/v1/user/update-user-kyc",
        exportCustomers: "/api/v1/user/export-users",
        saveUserBasicInformation: "/api/v1/user/save-user-basic-information",
        approveUser: "/api/v1/user/approve-user",

        // employee
        employeeLogin: "/api/v1/employee/employee-login",
        createEmployee: "/api/v1/employee/create-employee",
        getAllEmployees: "/api/v1/employee/get-all-employees",
        getEmployeeById: "/api/v1/employee/get-employee-by-id",
        updateEmployee: "/api/v1/employee/update-employee",
        deleteEmployee: "/api/v1/employee/delete-employee",

        // branch
        createBranch: "/api/v1/branch/create-branch",
        getAllBranches: "/api/v1/branch/get-all-branches",
        getBranchById: "/api/v1/branch/get-branch-by-id",
        updateBranch: "/api/v1/branch/update-branch",
        deleteBranch: "/api/v1/branch/delete-branch",

        // loan categories
        createLoanCategory: "/api/v1/loan-categories/create-loan-category",
        getAllLoanCategories: "/api/v1/loan-category/get-all-loan-categories",
        getLoanCategoryById: "/api/v1/loan-categories/get-loan-category-by-id",
        updateLoanCategory: "/api/v1/loan-categories/update-loan-category",
        deleteLoanCategory: "/api/v1/loan-categories/delete-loan-category",
        createLoanSubCategory: "/api/v1/loan-subcategories/create-loan-subcategory",
        updateLoanSubCategory: "/api/v1/loan-subcategories/update-loan-subcategory",
        deleteLoanSubCategory: "/api/v1/loan-subcategories/delete-loan-subcategory",

        // organization
        getAllOrganisations: "/api/v1/organisation/get-all-organisations",
        getOrganisationById: "/api/v1/organisation/get-organisation-by-id",

        // batch
        createBatch: "/api/v1/user/create-customer-batch",
        getAllBatches: "/api/v1/user/get-all-customer-batches",
        getBatchById: "/api/v1/user/get-customer-batch-by-id",
        getBatchesByEmployee: "/api/v1/user/get-batches-by-employee",
        getBatchCustomers: "/api/v1/user/get-batch-customers",
        updateBatch: "/api/v1/user/update-customer-batch",
        addCustomersToBatch: "/api/v1/user/add-customers-to-batch",
        removeCustomersFromBatch: "/api/v1/user/remove-customers-from-batch",
        updateBatchStatus: "/api/v1/user/update-batch-status",
        deleteBatch: "/api/v1/user/delete-customer-batch",
        getBatchStats: "/api/v1/user/get-batch-stats",

        // loan
        getAllLoans: "/api/v1/loan/get-all-loans",
        getLoanById: "/api/v1/loan/get-loan-by-id",
        approveLoan: "/api/v1/loan/approve-loan",
        rejectLoan: "/api/v1/loan/reject-loan",
        updateLoan: "/api/v1/loan/update-loan",

        // payment records
        getAllPaymentRecords: "/api/v1/agent/payment-record/get-all-payment-records",
        getPaymentRecordById: "/api/v1/agent/payment-record/get-payment-record-by-id",
        getPaymentRecordsByAgent: "/api/v1/agent/payment-record/get-payment-records-by-agent",
        createPaymentRecord: "/api/v1/agent/payment-record/create-payment-record",
        updatePaymentRecord: "/api/v1/agent/payment-record/update-payment-record",
        updatePaymentStatus: "/api/v1/agent/payment-record/update-payment-status",
        verifyPaymentRecord: "/api/v1/agent/payment-record/verify-payment-record",
        rejectPaymentRecord: "/api/v1/agent/payment-record/reject-payment-record",
        collectPaymentRecord: "/api/v1/agent/payment-record/collect-payment-record",
        deletePaymentRecord: "/api/v1/agent/payment-record/delete-payment-record",

        // deposits
        getAllDeposits: "/api/v1/deposit/get-all-deposits",
        verifyDeposit: "/api/v1/deposit/verify-deposit",

        // share transactions
        getAllShareTransactions: "/api/v1/share-transaction/get-all-transactions",
    }
}   