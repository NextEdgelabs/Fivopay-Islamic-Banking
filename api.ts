export const API = {
    domain: process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:5000",
  
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

        // employee
        employeeLogin:"/api/v1/employee/employee-login",

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
    }
}