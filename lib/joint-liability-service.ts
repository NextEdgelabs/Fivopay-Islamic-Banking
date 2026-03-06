
// Types
export type Member = {
  id: string;
  name: string;
  customerId?: string; // Link to customer if selected from system
  role: 'head' | 'member';
  depositAmount: number;
  availableCredit: number; // Limit distributed by head
  currentLoanAmount: number; // Active loan amount
  joinedAt: string;
};

export type Group = {
  id: string;
  name: string;
  members: Member[];
  totalDeposit: number;
  maxCreditLimit: number; // totalDeposit * 2
  createdAt: string;
};

export type Transaction = {
  id: string;
  groupId: string;
  type: 'deposit' | 'distribution' | 'loan_disbursement' | 'loan_repayment';
  amount: number;
  memberId?: string;
  memberName?: string;
  date: string;
  description: string;
};

export type Loan = {
  id: string;
  memberId: string;
  memberName: string;
  groupId: string;
  groupName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'repaid';
  appliedDate: string;
  purpose: string;
};

// Storage Keys
const GROUPS_KEY = 'fivopay_jl_groups';
const TRANSACTIONS_KEY = 'fivopay_jl_transactions';
const LOANS_KEY = 'fivopay_jl_loans';

// Helper to simulate UUID generation
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const JointLiabilityService = {
  // --- Groups ---
  getGroups: (): Group[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(GROUPS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading groups", e);
      return [];
    }
  },

  getGroupById: (id: string): Group | undefined => {
    const groups = JointLiabilityService.getGroups();
    return groups.find(g => g.id === id);
  },

  createGroup: (name: string, members: { name: string; depositAmount: number; role: 'head' | 'member'; customerId?: string }[]): Group => {
    const groups = JointLiabilityService.getGroups();
    
    // Calculate initial totals
    const totalDeposit = members.reduce((sum, m) => sum + m.depositAmount, 0);
    const maxCreditLimit = totalDeposit * 2;
    const timestamp = new Date().toISOString();

    const newMembers: Member[] = members.map(m => ({
      name: m.name,
      customerId: m.customerId,
      role: m.role,
      depositAmount: m.depositAmount,
      id: generateId(),
      availableCredit: 0, // Initially 0, head must distribute
      currentLoanAmount: 0,
      joinedAt: timestamp
    }));

    const newGroup: Group = {
      id: generateId(),
      name,
      members: newMembers,
      totalDeposit,
      maxCreditLimit,
      createdAt: timestamp
    };

    groups.push(newGroup);
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));

    // Record initial deposit transactions
    members.forEach((m, index) => {
        JointLiabilityService.addTransaction({
            groupId: newGroup.id,
            type: 'deposit',
            amount: m.depositAmount,
            memberId: newMembers[index].id,
            memberName: m.name,
            description: `Initial deposit by ${m.name}`
        });
    });

    return newGroup;
  },

  updateGroup: (updatedGroup: Group) => {
    const groups = JointLiabilityService.getGroups();
    const index = groups.findIndex(g => g.id === updatedGroup.id);
    if (index !== -1) {
      groups[index] = updatedGroup;
      localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
    }
  },

  // --- Distributions ---
  distributeCredit: (groupId: string, distributions: { memberId: string; amount: number }[]) => {
    const group = JointLiabilityService.getGroupById(groupId);
    if (!group) throw new Error("Group not found");

    // Calculate total distributed AFTER changes
    // We need to know the current distributed amount for members NOT in this distribution list
    // plus the new amounts for members IN the list.
    
    let newTotalDistributed = 0;

    const updatedMembers = group.members.map(m => {
        const dist = distributions.find(d => d.memberId === m.id);
        const newCredit = dist ? dist.amount : m.availableCredit;
        newTotalDistributed += newCredit;
        
        // Also validation: Cannot reduce limit below current loan amount
        if (dist && dist.amount < m.currentLoanAmount) {
             throw new Error(`Cannot reduce credit limit for ${m.name} below active loan amount (${m.currentLoanAmount})`);
        }

        return { ...m, availableCredit: newCredit };
    });
    
    if (newTotalDistributed > group.maxCreditLimit) {
       throw new Error(`Total distributed credit (${newTotalDistributed}) exceeds group limit (${group.maxCreditLimit}).`);
    }

    const updatedGroup = { ...group, members: updatedMembers };
    JointLiabilityService.updateGroup(updatedGroup);

    // Record transactions for distribution changes (optional, but good for audit)
    distributions.forEach(d => {
        const member = group.members.find(m => m.id === d.memberId);
        // Only log if amount changed
        if (member && member.availableCredit !== d.amount) {
            JointLiabilityService.addTransaction({
                groupId: group.id,
                type: 'distribution',
                amount: d.amount,
                memberId: member.id,
                memberName: member.name,
                description: `Credit limit updated to ${d.amount} for ${member.name}`
            });
        }
    });
  },

  // --- Loans ---
  getLoans: (): Loan[] => {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(LOANS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
  },

  applyForLoan: (groupId: string, memberId: string, amount: number, purpose: string) => {
    const group = JointLiabilityService.getGroupById(groupId);
    if (!group) throw new Error("Group not found");
    
    const member = group.members.find(m => m.id === memberId);
    if (!member) throw new Error("Member not found");

    // Calculate available credit based on total credit limit (proportional to deposit)
    // If credit has been distributed, use that; otherwise calculate proportional share
    const totalCreditLimit = group.maxCreditLimit;
    const memberProportionalLimit = group.totalDeposit > 0 
      ? (member.depositAmount / group.totalDeposit) * totalCreditLimit
      : 0;
    
    // Use distributed credit if available, otherwise use proportional
    const effectiveCreditLimit = member.availableCredit > 0 
      ? member.availableCredit 
      : memberProportionalLimit;
    
    // Check available credit (Limit - Current Loans)
    const availableToBorrow = effectiveCreditLimit - member.currentLoanAmount;
    if (amount > availableToBorrow) {
        throw new Error(`Loan amount exceeds available borrowing limit (₹${availableToBorrow.toLocaleString()})`);
    }

    const loans = JointLiabilityService.getLoans();
    const newLoan: Loan = {
        id: generateId(),
        groupId,
        groupName: group.name,
        memberId,
        memberName: member.name,
        amount,
        purpose,
        status: 'pending',
        appliedDate: new Date().toISOString()
    };

    loans.push(newLoan);
    localStorage.setItem(LOANS_KEY, JSON.stringify(loans));
    return newLoan;
  },

  updateLoanStatus: (loanId: string, status: Loan['status']) => {
    const loans = JointLiabilityService.getLoans();
    const index = loans.findIndex(l => l.id === loanId);
    
    if (index !== -1) {
        const loan = loans[index];
        const group = JointLiabilityService.getGroupById(loan.groupId);
        const member = group?.members.find(m => m.id === loan.memberId);

        if (status === 'approved' && loan.status !== 'approved') {
             if (group && member) {
                 // Double check limit using the same effective credit logic as at application time
                 const totalCreditLimit = group.maxCreditLimit;
                 const memberProportionalLimit = group.totalDeposit > 0
                   ? (member.depositAmount / group.totalDeposit) * totalCreditLimit
                   : 0;
                 
                 const effectiveCreditLimit = member.availableCredit > 0
                   ? member.availableCredit
                   : memberProportionalLimit;

                 const availableToBorrow = effectiveCreditLimit - member.currentLoanAmount;
                 if (loan.amount > availableToBorrow) {
                     throw new Error(`Insufficient credit limit at approval time (available: ₹${Math.max(0, availableToBorrow).toLocaleString()})`);
                 }

                 // Update member's current loan amount
                 const updatedMembers = group.members.map(m => {
                     if (m.id === member.id) {
                         return { ...m, currentLoanAmount: m.currentLoanAmount + loan.amount };
                     }
                     return m;
                 });
                 JointLiabilityService.updateGroup({ ...group, members: updatedMembers });
                 
                 JointLiabilityService.addTransaction({
                    groupId: group.id,
                    type: 'loan_disbursement',
                    amount: loan.amount,
                    memberId: member.id,
                    memberName: member.name,
                    description: `Loan disbursed to ${member.name}`
                 });
             }
        }

        loans[index] = { ...loan, status };
        localStorage.setItem(LOANS_KEY, JSON.stringify(loans));
    }
  },

  repayLoan: (loanId: string, amount: number) => {
    const loans = JointLiabilityService.getLoans();
    const loan = loans.find(l => l.id === loanId);
    if (!loan) throw new Error("Loan not found");
    if (loan.status !== 'approved') throw new Error("Only approved loans can be repaid");

    const group = JointLiabilityService.getGroupById(loan.groupId);
    const member = group?.members.find(m => m.id === loan.memberId);
    if (!group || !member) throw new Error("Group or member not found");

    if (amount > member.currentLoanAmount) {
      throw new Error(`Repayment amount cannot exceed current loan amount (${member.currentLoanAmount})`);
    }

    // Update member's current loan amount
    const updatedMembers = group.members.map(m => {
      if (m.id === member.id) {
        const newLoanAmount = m.currentLoanAmount - amount;
        return { ...m, currentLoanAmount: Math.max(0, newLoanAmount) };
      }
      return m;
    });
    JointLiabilityService.updateGroup({ ...group, members: updatedMembers });

    // Update loan status if fully repaid
    const updatedLoan = loans.find(l => l.id === loanId);
    if (updatedLoan) {
      const memberAfterUpdate = updatedMembers.find(m => m.id === member.id);
      if (memberAfterUpdate && memberAfterUpdate.currentLoanAmount === 0) {
        updatedLoan.status = 'repaid';
      }
      const loanIndex = loans.findIndex(l => l.id === loanId);
      loans[loanIndex] = updatedLoan;
      localStorage.setItem(LOANS_KEY, JSON.stringify(loans));
    }

    // Record transaction
    JointLiabilityService.addTransaction({
      groupId: group.id,
      type: 'loan_repayment',
      amount: amount,
      memberId: member.id,
      memberName: member.name,
      description: `Loan repayment of ₹${amount} by ${member.name}`
    });
  },

  deleteGroup: (groupId: string) => {
    const groups = JointLiabilityService.getGroups();
    const filtered = groups.filter(g => g.id !== groupId);
    localStorage.setItem(GROUPS_KEY, JSON.stringify(filtered));
  },

  addMemberToGroup: (groupId: string, member: { name: string; depositAmount: number; role: 'head' | 'member'; customerId?: string }) => {
    const group = JointLiabilityService.getGroupById(groupId);
    if (!group) throw new Error("Group not found");

    if (group.members.length >= 20) {
      throw new Error("Maximum 20 members allowed per group");
    }

    // If setting as head, change existing head to member
    let updatedMembers = [...group.members];
    if (member.role === 'head') {
      updatedMembers = group.members.map(m => ({ ...m, role: 'member' as const }));
    }

    const newMember: Member = {
      id: generateId(),
      name: member.name,
      customerId: member.customerId,
      role: member.role,
      depositAmount: member.depositAmount,
      availableCredit: 0,
      currentLoanAmount: 0,
      joinedAt: new Date().toISOString()
    };

    updatedMembers.push(newMember);

    // Recalculate totals
    const totalDeposit = updatedMembers.reduce((sum, m) => sum + m.depositAmount, 0);
    const maxCreditLimit = totalDeposit * 2;

    const updatedGroup: Group = {
      ...group,
      members: updatedMembers,
      totalDeposit,
      maxCreditLimit
    };

    JointLiabilityService.updateGroup(updatedGroup);

    // Record deposit transaction
    JointLiabilityService.addTransaction({
      groupId: group.id,
      type: 'deposit',
      amount: member.depositAmount,
      memberId: newMember.id,
      memberName: member.name,
      description: `Deposit by ${member.name} (added to group)`
    });

    return updatedGroup;
  },

  removeMemberFromGroup: (groupId: string, memberId: string) => {
    const group = JointLiabilityService.getGroupById(groupId);
    if (!group) throw new Error("Group not found");

    const member = group.members.find(m => m.id === memberId);
    if (!member) throw new Error("Member not found");

    // Validation: Can't remove if member has active loans
    if (member.currentLoanAmount > 0) {
      throw new Error(`Cannot remove ${member.name}. Member has active loan of ₹${member.currentLoanAmount.toLocaleString()}`);
    }

    // Validation: Can't remove if member has distributed credit
    if (member.availableCredit > 0) {
      throw new Error(`Cannot remove ${member.name}. Member has distributed credit of ₹${member.availableCredit.toLocaleString()}. Please redistribute credit first.`);
    }

    // Validation: Can't remove if it's the only member
    if (group.members.length <= 1) {
      throw new Error("Cannot remove the last member from the group");
    }

    // Validation: Can't remove head if it's the only head
    if (member.role === 'head' && group.members.filter(m => m.role === 'head').length === 1) {
      throw new Error("Cannot remove the only head. Please assign another member as head first.");
    }

    const updatedMembers = group.members.filter(m => m.id !== memberId);

    // Recalculate totals
    const totalDeposit = updatedMembers.reduce((sum, m) => sum + m.depositAmount, 0);
    const maxCreditLimit = totalDeposit * 2;

    // Adjust distributed credit if it exceeds new limit
    const currentDistributed = updatedMembers.reduce((sum, m) => sum + m.availableCredit, 0);
    if (currentDistributed > maxCreditLimit) {
      // Proportionally reduce each member's credit
      const ratio = maxCreditLimit / currentDistributed;
      updatedMembers.forEach(m => {
        m.availableCredit = Math.floor(m.availableCredit * ratio);
      });
    }

    const updatedGroup: Group = {
      ...group,
      members: updatedMembers,
      totalDeposit,
      maxCreditLimit
    };

    JointLiabilityService.updateGroup(updatedGroup);

    // Record transaction
    JointLiabilityService.addTransaction({
      groupId: group.id,
      type: 'deposit',
      amount: -member.depositAmount,
      memberId: member.id,
      memberName: member.name,
      description: `Member ${member.name} removed from group (deposit refunded)`
    });

    return updatedGroup;
  },

  addDepositToMember: (groupId: string, memberId: string, amount: number) => {
    const group = JointLiabilityService.getGroupById(groupId);
    if (!group) throw new Error("Group not found");

    const member = group.members.find(m => m.id === memberId);
    if (!member) throw new Error("Member not found");

    if (amount <= 0) {
      throw new Error("Deposit amount must be greater than 0");
    }

    // Update member's deposit amount
    const updatedMembers = group.members.map(m => {
      if (m.id === memberId) {
        return { ...m, depositAmount: m.depositAmount + amount };
      }
      return m;
    });

    // Recalculate totals
    const totalDeposit = updatedMembers.reduce((sum, m) => sum + m.depositAmount, 0);
    const maxCreditLimit = totalDeposit * 2;

    const updatedGroup: Group = {
      ...group,
      members: updatedMembers,
      totalDeposit,
      maxCreditLimit
    };

    JointLiabilityService.updateGroup(updatedGroup);

    // Record deposit transaction
    JointLiabilityService.addTransaction({
      groupId: group.id,
      type: 'deposit',
      amount: amount,
      memberId: member.id,
      memberName: member.name,
      description: `Additional deposit of ₹${amount.toLocaleString()} by ${member.name}`
    });

    return updatedGroup;
  },

  // --- Transactions ---
  getTransactions: (): Transaction[] => {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(TRANSACTIONS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
  },

  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const transactions = JointLiabilityService.getTransactions();
    const newTx: Transaction = {
        ...transaction,
        id: generateId(),
        date: new Date().toISOString()
    };
    transactions.unshift(newTx); 
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }
};

