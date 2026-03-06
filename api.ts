export const API = {
    domain: process.env.NEXT_PUBLIC_DOMAIN || "https://api.fivopay.nextlabsonline.com",
    // domain:"http://localhost:4000",
  
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
        getNextEmployeeId: "/api/v1/employee/get-next-employee-id",
        updateEmployee: "/api/v1/employee/update-employee",
        deleteEmployee: "/api/v1/employee/delete-employee",

        // branch
        createBranch: "/api/v1/branch/create-branch",
        getAllBranches: "/api/v1/branch/get-all-branches",
        getBranchById: "/api/v1/branch/get-branch-by-id",
        updateBranch: "/api/v1/branch/update-branch",
        deleteBranch: "/api/v1/branch/delete-branch",

        // loan categories
        createLoanCategory: "/api/v1/loan-category/create-loan-category",
        getAllLoanCategories: "/api/v1/loan-category/get-all-loan-categories",
        getLoanCategoryById: "/api/v1/loan-category/get-loan-category-by-id",
        updateLoanCategory: "/api/v1/loan-category/update-loan-category",
        deleteLoanCategory: "/api/v1/loan-category/delete-loan-category",
        createLoanSubCategory: "/api/v1/loan-subcategory/create-loan-subcategory",
        updateLoanSubCategory: "/api/v1/loan-subcategory/update-loan-subcategory",
        deleteLoanSubCategory: "/api/v1/loan-subcategory/delete-loan-subcategory",

        // loan products
        createLoanProduct: "/api/v1/loan-product/create-loan-product",
        getAllLoanProducts: "/api/v1/loan-product/get-all-loan-products",
        getLoanProductById: "/api/v1/loan-product/get-loan-product-by-id",
        updateLoanProduct: "/api/v1/loan-product/update-loan-product",
        deleteLoanProduct: "/api/v1/loan-product/delete-loan-product",

        // organization
        getAllOrganisations: "/api/v1/organisation/get-all-organisations",
        getOrganisationById: "/api/v1/organisation/get-organisation-by-id",
        updateOrganisation: "/api/v1/organisation/update-organisation",

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

        // deposit accounts (savings/FD/RD)
        createDepositAccount: "/api/v1/deposit/account/create",
        updateDepositAccount: "/api/v1/deposit/account/update",
        getAllDepositAccounts: "/api/v1/deposit/account/get-all",
        getDepositAccountById: "/api/v1/deposit/account/get-by-id",

        // deposit categories
        createDepositCategory: "/api/v1/deposit/category/create",
        getAllDepositCategories: "/api/v1/deposit/category/get-all",
        getDepositCategoryById: "/api/v1/deposit/category/get-by-id",
        getDepositCategoriesByType: "/api/v1/deposit/category/get-by-type",
        updateDepositCategory: "/api/v1/deposit/category/update",
        deleteDepositCategory: "/api/v1/deposit/category/delete",

        // deposit products
        createDepositProduct: "/api/v1/deposit/product/create",
        getAllDepositProducts: "/api/v1/deposit/product/get-all",
        getDepositProductById: "/api/v1/deposit/product/get-by-id",
        getDepositProductsByCategory: "/api/v1/deposit/product/get-by-category",
        getDepositProductsByType: "/api/v1/deposit/product/get-by-type",
        updateDepositProduct: "/api/v1/deposit/product/update",
        deleteDepositProduct: "/api/v1/deposit/product/delete",

        // share transactions
        getAllShareTransactions: "/api/v1/share-transaction/get-all-transactions",
        recordShareTransaction: "/api/v1/share-transaction/record-transaction",

        // investment transactions
        getAllInvestmentTransactions: "/api/v1/investment-transaction/get-all-transactions",

        // joint liability
        jointLiability: {
          groupCreate: "/api/v1/joint-liability/group/create",
          groupGetAll: "/api/v1/joint-liability/group/get-all",
          groupGetById: "/api/v1/joint-liability/group/get-by-id",
          groupUpdate: "/api/v1/joint-liability/group/update",
          groupDistribute: "/api/v1/joint-liability/group/distribute",
          groupAddMember: "/api/v1/joint-liability/group/add-member",
          groupRemoveMember: "/api/v1/joint-liability/group/remove-member",
          groupAddDeposit: "/api/v1/joint-liability/group/add-deposit",
          groupDelete: "/api/v1/joint-liability/group/delete",
          loanGetAll: "/api/v1/joint-liability/loan/get-all",
          loanApply: "/api/v1/joint-liability/loan/apply",
          loanUpdateStatus: "/api/v1/joint-liability/loan/update-status",
          loanRepay: "/api/v1/joint-liability/loan/repay",
          transactionGetAll: "/api/v1/joint-liability/transaction/get-all",
        },
    }
}   
