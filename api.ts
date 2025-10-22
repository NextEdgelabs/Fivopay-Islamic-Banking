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
        employeeLogin:"/api/v1/employee/employee-login"
    }
}