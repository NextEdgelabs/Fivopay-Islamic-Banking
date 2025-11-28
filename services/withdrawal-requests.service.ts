// Withdrawal Request Service - Using localStorage for dummy data
// This is for demonstration purposes only

export interface WithdrawalRequest {
  id: string;
  customerId: string;
  customerName: string;
  branchId: string;
  branchName: string;
  amount: number;
  accountNumber?: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  assignedAgentId?: string;
  assignedAgentName?: string;
  approvedDate?: string;
  completedDate?: string;
  notes?: string;
  rejectionReason?: string;
}

const STORAGE_KEY = 'withdrawal_requests';

// Generate dummy withdrawal requests
const generateDummyRequests = (branchId: string, branchName: string): WithdrawalRequest[] => {
  const dummyCustomers = [
    { id: 'cust1', name: 'Rajesh Kumar', accountNumber: 'ACC001' },
    { id: 'cust2', name: 'Priya Sharma', accountNumber: 'ACC002' },
    { id: 'cust3', name: 'Amit Patel', accountNumber: 'ACC003' },
    { id: 'cust4', name: 'Sneha Reddy', accountNumber: 'ACC004' },
    { id: 'cust5', name: 'Vikram Singh', accountNumber: 'ACC005' },
  ];

  const requests: WithdrawalRequest[] = [];
  const now = new Date();

  dummyCustomers.forEach((customer, index) => {
    const requestDate = new Date(now);
    requestDate.setDate(requestDate.getDate() - (index + 1));

    requests.push({
      id: `wr_${branchId}_${index + 1}`,
      customerId: customer.id,
      customerName: customer.name,
      branchId,
      branchName,
      amount: Math.floor(Math.random() * 50000) + 10000, // ₹10,000 - ₹60,000
      accountNumber: customer.accountNumber,
      requestDate: requestDate.toISOString(),
      status: index === 0 ? 'pending' : index === 1 ? 'approved' : 'pending',
      assignedAgentId: index === 1 ? 'agent1' : undefined,
      assignedAgentName: index === 1 ? 'John Agent' : undefined,
      approvedDate: index === 1 ? new Date(requestDate.getTime() + 86400000).toISOString() : undefined,
    });
  });

  return requests;
};

export const withdrawalRequestService = {
  // Get all withdrawal requests for a branch
  getWithdrawalRequests: (branchId: string): WithdrawalRequest[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Initialize with dummy data
        const dummyData = generateDummyRequests(branchId, 'Branch');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyData));
        return dummyData.filter(r => r.branchId === branchId);
      }

      const allRequests: WithdrawalRequest[] = JSON.parse(stored);
      return allRequests.filter(r => r.branchId === branchId);
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
      return [];
    }
  },

  // Get all withdrawal requests assigned to an agent
  getWithdrawalRequestsByAgent: (agentId: string): WithdrawalRequest[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const allRequests: WithdrawalRequest[] = JSON.parse(stored);
      return allRequests.filter(r => r.assignedAgentId === agentId);
    } catch (error) {
      console.error('Error fetching withdrawal requests by agent:', error);
      return [];
    }
  },

  // Get a single withdrawal request
  getWithdrawalRequest: (id: string): WithdrawalRequest | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const allRequests: WithdrawalRequest[] = JSON.parse(stored);
      return allRequests.find(r => r.id === id) || null;
    } catch (error) {
      console.error('Error fetching withdrawal request:', error);
      return null;
    }
  },

  // Approve a withdrawal request
  approveWithdrawalRequest: (
    id: string,
    agentId: string,
    agentName: string,
    notes?: string
  ): WithdrawalRequest | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const allRequests: WithdrawalRequest[] = JSON.parse(stored);
      const requestIndex = allRequests.findIndex(r => r.id === id);

      if (requestIndex === -1) return null;

      const updatedRequest: WithdrawalRequest = {
        ...allRequests[requestIndex],
        status: 'approved',
        assignedAgentId: agentId,
        assignedAgentName: agentName,
        approvedDate: new Date().toISOString(),
        notes,
      };

      allRequests[requestIndex] = updatedRequest;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allRequests));

      return updatedRequest;
    } catch (error) {
      console.error('Error approving withdrawal request:', error);
      return null;
    }
  },

  // Reject a withdrawal request
  rejectWithdrawalRequest: (id: string, reason: string): WithdrawalRequest | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const allRequests: WithdrawalRequest[] = JSON.parse(stored);
      const requestIndex = allRequests.findIndex(r => r.id === id);

      if (requestIndex === -1) return null;

      const updatedRequest: WithdrawalRequest = {
        ...allRequests[requestIndex],
        status: 'rejected',
        rejectionReason: reason,
      };

      allRequests[requestIndex] = updatedRequest;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allRequests));

      return updatedRequest;
    } catch (error) {
      console.error('Error rejecting withdrawal request:', error);
      return null;
    }
  },

  // Complete a withdrawal request
  completeWithdrawalRequest: (id: string): WithdrawalRequest | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const allRequests: WithdrawalRequest[] = JSON.parse(stored);
      const requestIndex = allRequests.findIndex(r => r.id === id);

      if (requestIndex === -1) return null;

      const updatedRequest: WithdrawalRequest = {
        ...allRequests[requestIndex],
        status: 'completed',
        completedDate: new Date().toISOString(),
      };

      allRequests[requestIndex] = updatedRequest;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allRequests));

      return updatedRequest;
    } catch (error) {
      console.error('Error completing withdrawal request:', error);
      return null;
    }
  },

  // Check if customer exists in any batch and get the agent
  // This will be called from the component with batch data
  findCustomerBatchAgent: (customerId: string, batches: any[]): { agentId: string; agentName: string; batchName: string } | null => {
    try {
      // Find batch that contains this customer
      for (const batch of batches) {
        const customers = batch.customers || [];
        const customerIds = customers.map((c: any) => 
          typeof c === 'string' ? c : (c._id || c.id || c.customerId)
        );
        
        if (customerIds.includes(customerId)) {
          // Get employee/agent from batch
          const employee = typeof batch.employeeId === 'object' ? batch.employeeId : null;
          if (employee) {
            return {
              agentId: employee._id || employee.id || '',
              agentName: employee.fullName || 'Unknown Agent',
              batchName: batch.batchName || 'Unknown Batch',
            };
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error finding customer batch agent:', error);
      return null;
    }
  },
};

