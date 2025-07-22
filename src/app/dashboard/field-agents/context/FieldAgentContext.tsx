'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  FieldAgent,
  Collection,
  CustomerAssignment,
  CollectionReport,
  AgentPerformance,
  TerritoryStatistics,
  BranchCollectionStats,
  NewAgentFormData,
  NewCollectionFormData,
  NewAssignmentFormData,
  CollectionStatistics,
} from '../types';

interface FieldAgentContextType {
  // State
  agents: FieldAgent[];
  collections: Collection[];
  assignments: CustomerAssignment[];
  reports: CollectionReport[];
  agentPerformance: AgentPerformance[];
  territoryStats: TerritoryStatistics[];
  branchStats: BranchCollectionStats[];
  
  // Agent actions
  addAgent: (agentData: NewAgentFormData) => string;
  updateAgent: (agentId: string, updates: Partial<FieldAgent>) => void;
  deleteAgent: (agentId: string) => void;
  getAgentById: (agentId: string) => FieldAgent | undefined;
  getAgentsByStatus: (status: FieldAgent['status']) => FieldAgent[];
  getAgentsByBranch: (branchId: string) => FieldAgent[];
  
  // Collection actions
  addCollection: (collectionData: NewCollectionFormData) => string;
  updateCollection: (collectionId: string, updates: Partial<Collection>) => void;
  deleteCollection: (collectionId: string) => void;
  getCollectionById: (collectionId: string) => Collection | undefined;
  getCollectionsByAgent: (agentId: string) => Collection[];
  getCollectionsByStatus: (status: Collection['status']) => Collection[];
  getCollectionsByDateRange: (startDate: string, endDate: string) => Collection[];
  
  // Assignment actions
  addAssignment: (assignmentData: NewAssignmentFormData) => string;
  updateAssignment: (assignmentId: string, updates: Partial<CustomerAssignment>) => void;
  deleteAssignment: (assignmentId: string) => void;
  getAssignmentById: (assignmentId: string) => CustomerAssignment | undefined;
  getAssignmentsByAgent: (agentId: string) => CustomerAssignment[];
  getAssignmentsByCustomer: (customerId: string) => CustomerAssignment[];
  getAssignmentsByStatus: (status: CustomerAssignment['status']) => CustomerAssignment[];
  
  // Report actions
  generateCollectionReport: (agentId: string, dateRange: { startDate: string; endDate: string }) => CollectionReport;
  generateAgentPerformanceReport: (agentId: string) => AgentPerformance;
  generateTerritoryReport: (territory: string) => TerritoryStatistics;
  generateBranchReport: (branchId: string) => BranchCollectionStats;
  
  // Statistics
  getCollectionStatistics: () => CollectionStatistics;
  getAgentStatistics: () => {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    averagePerformance: number;
  };
  getAssignmentStatistics: () => {
    total: number;
    active: number;
    inactive: number;
    temporary: number;
    totalOutstanding: number;
  };
  
  // Utility functions
  generateAgentCode: () => string;
  generateCollectionCode: () => string;
  generateAssignmentId: () => string;
  calculatePerformanceRating: (agentId: string) => number;
}

const FieldAgentContext = createContext<FieldAgentContextType | undefined>(undefined);

interface FieldAgentProviderProps {
  children: ReactNode;
}

export const FieldAgentProvider: React.FC<FieldAgentProviderProps> = ({ children }) => {
  const [agents, setAgents] = useState<FieldAgent[]>([
    {
      id: '1',
      agentCode: 'FA001',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@fivopay.com',
      phone: '+91 98765 43210',
      branchId: 'FP001',
      branchName: 'Mumbai Main Branch',
      status: 'Active',
      joinDate: '2023-01-15',
      lastActivity: '2024-01-20T10:30:00Z',
      totalCollections: 156,
      totalAmountCollected: 1250000,
      assignedCustomers: 45,
      performanceRating: 92,
      supervisorName: 'Priya Desai',
      supervisorPhone: '+91 98765 43211',
      territory: 'North Mumbai',
      vehicleNumber: 'MH01AB1234',
      idProofNumber: 'A123456789',
      emergencyContact: 'Mrs. Sharma',
      emergencyPhone: '+91 98765 43212',
    },
    {
      id: '2',
      agentCode: 'FA002',
      name: 'Amit Patel',
      email: 'amit.patel@fivopay.com',
      phone: '+91 98765 43213',
      branchId: 'FP002',
      branchName: 'Bandra Branch',
      status: 'Active',
      joinDate: '2023-03-20',
      lastActivity: '2024-01-20T09:15:00Z',
      totalCollections: 142,
      totalAmountCollected: 980000,
      assignedCustomers: 38,
      performanceRating: 88,
      supervisorName: 'Sunita Gupta',
      supervisorPhone: '+91 98765 43214',
      territory: 'South Mumbai',
      vehicleNumber: 'MH02CD5678',
      idProofNumber: 'B987654321',
      emergencyContact: 'Mr. Patel',
      emergencyPhone: '+91 98765 43215',
    },
    {
      id: '3',
      agentCode: 'FA003',
      name: 'Priya Singh',
      email: 'priya.singh@fivopay.com',
      phone: '+91 98765 43216',
      branchId: 'FP003',
      branchName: 'Pune Branch',
      status: 'Active',
      joinDate: '2023-06-10',
      lastActivity: '2024-01-20T11:45:00Z',
      totalCollections: 128,
      totalAmountCollected: 850000,
      assignedCustomers: 32,
      performanceRating: 85,
      supervisorName: 'Rajesh Kumar',
      supervisorPhone: '+91 98765 43217',
      territory: 'Pune City',
      vehicleNumber: 'MH12EF9012',
      idProofNumber: 'C456789123',
      emergencyContact: 'Mrs. Singh',
      emergencyPhone: '+91 98765 43218',
    },
  ]);

  const [collections, setCollections] = useState<Collection[]>([
    {
      id: '1',
      collectionCode: 'COL001',
      agentId: 'FA001',
      agentName: 'Rahul Sharma',
      customerId: 'CUST001',
      customerName: 'Ahmed Hassan',
      customerPhone: '+971 50 123 4567',
      amount: 15000,
      collectionType: 'Cash',
      status: 'Completed',
      collectionDate: '2024-01-20T10:30:00Z',
      dueDate: '2024-01-20T00:00:00Z',
      branchId: 'FP001',
      branchName: 'Mumbai Main Branch',
      receiptNumber: 'RCP001234',
      notes: 'Collection from customer residence',
      location: 'Andheri East, Mumbai',
      paymentMethod: 'Cash',
      verificationStatus: 'Verified',
      verifiedBy: 'Priya Desai',
      verificationDate: '2024-01-20T11:00:00Z',
    },
    {
      id: '2',
      collectionCode: 'COL002',
      agentId: 'FA002',
      agentName: 'Amit Patel',
      customerId: 'CUST002',
      customerName: 'Fatima Al-Zahra',
      customerPhone: '+971 50 234 5678',
      amount: 25000,
      collectionType: 'Cheque',
      status: 'Pending',
      collectionDate: '2024-01-20T09:15:00Z',
      dueDate: '2024-01-21T00:00:00Z',
      branchId: 'FP002',
      branchName: 'Bandra Branch',
      receiptNumber: 'RCP001235',
      notes: 'Cheque collection from business premises',
      location: 'Bandra West, Mumbai',
      paymentMethod: 'Cheque',
      verificationStatus: 'Pending',
    },
  ]);

  const [assignments, setAssignments] = useState<CustomerAssignment[]>([
    {
      id: '1',
      agentId: 'FA001',
      agentName: 'Rahul Sharma',
      customerId: 'CUST001',
      customerName: 'Ahmed Hassan',
      customerPhone: '+971 50 123 4567',
      customerAddress: 'Andheri East, Mumbai, Maharashtra',
      assignmentDate: '2024-01-15',
      status: 'Active',
      collectionFrequency: 'Weekly',
      lastCollectionDate: '2024-01-18',
      nextCollectionDate: '2024-01-25',
      totalAmountDue: 50000,
      outstandingAmount: 15000,
      branchId: 'FP001',
      branchName: 'Mumbai Main Branch',
      notes: 'Regular weekly collection from residence',
    },
    {
      id: '2',
      agentId: 'FA002',
      agentName: 'Amit Patel',
      customerId: 'CUST002',
      customerName: 'Fatima Al-Zahra',
      customerPhone: '+971 50 234 5678',
      customerAddress: 'Bandra West, Mumbai, Maharashtra',
      assignmentDate: '2024-01-10',
      status: 'Active',
      collectionFrequency: 'Monthly',
      lastCollectionDate: '2024-01-15',
      nextCollectionDate: '2024-02-15',
      totalAmountDue: 75000,
      outstandingAmount: 25000,
      branchId: 'FP002',
      branchName: 'Bandra Branch',
      notes: 'Monthly collection from business premises',
    },
  ]);

  const [reports] = useState<CollectionReport[]>([]);
  const [agentPerformance] = useState<AgentPerformance[]>([]);
  const [territoryStats] = useState<TerritoryStatistics[]>([]);
  const [branchStats] = useState<BranchCollectionStats[]>([]);

  // Utility functions
  const generateAgentCode = () => {
    return `FA${String(agents.length + 1).padStart(3, '0')}`;
  };

  const generateCollectionCode = () => {
    return `COL${String(collections.length + 1).padStart(3, '0')}`;
  };

  const generateAssignmentId = () => {
    return String(assignments.length + 1);
  };

  const calculatePerformanceRating = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return 0;
    
    // Simple performance calculation based on collections and success rate
    const agentCollections = collections.filter(c => c.agentId === agentId);
    const successfulCollections = agentCollections.filter(c => c.status === 'Completed').length;
    const successRate = agentCollections.length > 0 ? (successfulCollections / agentCollections.length) * 100 : 0;
    
    return Math.round(successRate);
  };

  // Agent actions
  const addAgent = (agentData: NewAgentFormData): string => {
    const newAgent: FieldAgent = {
      id: String(agents.length + 1),
      agentCode: generateAgentCode(),
      name: agentData.name,
      email: agentData.email,
      phone: agentData.phone,
      branchId: agentData.branchId,
      branchName: agentData.branchId === 'FP001' ? 'Mumbai Main Branch' : 
                  agentData.branchId === 'FP002' ? 'Bandra Branch' : 'Pune Branch',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString(),
      totalCollections: 0,
      totalAmountCollected: 0,
      assignedCustomers: 0,
      performanceRating: 0,
      supervisorName: agentData.supervisorName,
      supervisorPhone: agentData.supervisorPhone,
      territory: agentData.territory,
      vehicleNumber: agentData.vehicleNumber,
      idProofNumber: agentData.idProofNumber,
      emergencyContact: agentData.emergencyContact,
      emergencyPhone: agentData.emergencyPhone,
    };

    setAgents(prev => [...prev, newAgent]);
    return newAgent.id;
  };

  const updateAgent = (agentId: string, updates: Partial<FieldAgent>) => {
    setAgents(prev => 
      prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, ...updates }
          : agent
      )
    );
  };

  const deleteAgent = (agentId: string) => {
    setAgents(prev => prev.filter(agent => agent.id !== agentId));
  };

  const getAgentById = (agentId: string) => {
    return agents.find(agent => agent.id === agentId);
  };

  const getAgentsByStatus = (status: FieldAgent['status']) => {
    return agents.filter(agent => agent.status === status);
  };

  const getAgentsByBranch = (branchId: string) => {
    return agents.filter(agent => agent.branchId === branchId);
  };

  // Collection actions
  const addCollection = (collectionData: NewCollectionFormData): string => {
    const newCollection: Collection = {
      id: String(collections.length + 1),
      collectionCode: generateCollectionCode(),
      agentId: collectionData.agentId,
      agentName: collectionData.agentId === 'FA001' ? 'Rahul Sharma' : 
                 collectionData.agentId === 'FA002' ? 'Amit Patel' : 'Priya Singh',
      customerId: collectionData.customerId,
      customerName: collectionData.customerId === 'CUST001' ? 'Ahmed Hassan' : 
                   collectionData.customerId === 'CUST002' ? 'Fatima Al-Zahra' : 'Mohammed Ali',
      customerPhone: '+971 50 123 4567',
      amount: collectionData.amount,
      collectionType: collectionData.collectionType,
      status: 'Pending',
      collectionDate: collectionData.collectionDate,
      dueDate: collectionData.dueDate,
      branchId: 'FP001',
      branchName: 'Mumbai Main Branch',
      receiptNumber: `RCP${String(Date.now()).slice(-6)}`,
      notes: collectionData.notes,
      location: collectionData.location,
      paymentMethod: collectionData.paymentMethod,
      verificationStatus: 'Pending',
    };

    setCollections(prev => [newCollection, ...prev]);
    return newCollection.id;
  };

  const updateCollection = (collectionId: string, updates: Partial<Collection>) => {
    setCollections(prev => 
      prev.map(collection => 
        collection.id === collectionId 
          ? { ...collection, ...updates }
          : collection
      )
    );
  };

  const deleteCollection = (collectionId: string) => {
    setCollections(prev => prev.filter(collection => collection.id !== collectionId));
  };

  const getCollectionById = (collectionId: string) => {
    return collections.find(collection => collection.id === collectionId);
  };

  const getCollectionsByAgent = (agentId: string) => {
    return collections.filter(collection => collection.agentId === agentId);
  };

  const getCollectionsByStatus = (status: Collection['status']) => {
    return collections.filter(collection => collection.status === status);
  };

  const getCollectionsByDateRange = (startDate: string, endDate: string) => {
    return collections.filter(collection => {
      const collectionDate = new Date(collection.collectionDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return collectionDate >= start && collectionDate <= end;
    });
  };

  // Assignment actions
  const addAssignment = (assignmentData: NewAssignmentFormData): string => {
    const newAssignment: CustomerAssignment = {
      id: generateAssignmentId(),
      agentId: assignmentData.agentId,
      agentName: assignmentData.agentId === 'FA001' ? 'Rahul Sharma' : 
                 assignmentData.agentId === 'FA002' ? 'Amit Patel' : 'Priya Singh',
      customerId: assignmentData.customerId,
      customerName: assignmentData.customerId === 'CUST001' ? 'Ahmed Hassan' : 
                   assignmentData.customerId === 'CUST002' ? 'Fatima Al-Zahra' : 'Mohammed Ali',
      customerPhone: '+971 50 123 4567',
      customerAddress: 'Mumbai, Maharashtra',
      assignmentDate: assignmentData.assignmentDate,
      status: 'Active',
      collectionFrequency: assignmentData.collectionFrequency,
      totalAmountDue: 50000,
      outstandingAmount: 50000,
      branchId: 'FP001',
      branchName: 'Mumbai Main Branch',
      notes: assignmentData.notes,
    };

    setAssignments(prev => [newAssignment, ...prev]);
    return newAssignment.id;
  };

  const updateAssignment = (assignmentId: string, updates: Partial<CustomerAssignment>) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, ...updates }
          : assignment
      )
    );
  };

  const deleteAssignment = (assignmentId: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
  };

  const getAssignmentById = (assignmentId: string) => {
    return assignments.find(assignment => assignment.id === assignmentId);
  };

  const getAssignmentsByAgent = (agentId: string) => {
    return assignments.filter(assignment => assignment.agentId === agentId);
  };

  const getAssignmentsByCustomer = (customerId: string) => {
    return assignments.filter(assignment => assignment.customerId === customerId);
  };

  const getAssignmentsByStatus = (status: CustomerAssignment['status']) => {
    return assignments.filter(assignment => assignment.status === status);
  };

  // Report actions
  const generateCollectionReport = (agentId: string, dateRange: { startDate: string; endDate: string }): CollectionReport => {
    const agentCollections = getCollectionsByAgent(agentId);
    const agent = getAgentById(agentId);
    
    return {
      id: Date.now().toString(),
      reportDate: new Date().toISOString().split('T')[0],
      agentId,
      agentName: agent?.name || '',
      totalCollections: agentCollections.length,
      totalAmount: agentCollections.reduce((sum, c) => sum + c.amount, 0),
      successfulCollections: agentCollections.filter(c => c.status === 'Completed').length,
      failedCollections: agentCollections.filter(c => c.status === 'Failed').length,
      pendingCollections: agentCollections.filter(c => c.status === 'Pending').length,
      averageCollectionAmount: agentCollections.length > 0 ? 
        agentCollections.reduce((sum, c) => sum + c.amount, 0) / agentCollections.length : 0,
      branchId: agent?.branchId || '',
      branchName: agent?.branchName || '',
      territory: agent?.territory || '',
      performanceScore: calculatePerformanceRating(agentId),
    };
  };

  const generateAgentPerformanceReport = (agentId: string): AgentPerformance => {
    const agent = getAgentById(agentId);
    const agentCollections = getCollectionsByAgent(agentId);
    const successfulCollections = agentCollections.filter(c => c.status === 'Completed').length;
    const successRate = agentCollections.length > 0 ? (successfulCollections / agentCollections.length) * 100 : 0;
    
    return {
      agentId,
      agentName: agent?.name || '',
      totalCollections: agentCollections.length,
      totalAmount: agentCollections.reduce((sum, c) => sum + c.amount, 0),
      successRate,
      averageCollectionTime: 45, // Mock data
      customerSatisfaction: 4.5, // Mock data
      territory: agent?.territory || '',
      branchId: agent?.branchId || '',
      branchName: agent?.branchName || '',
      monthlyTarget: 1000000, // Mock data
      monthlyAchievement: agentCollections.reduce((sum, c) => sum + c.amount, 0),
      performanceRating: calculatePerformanceRating(agentId),
    };
  };

  const generateTerritoryReport = (territory: string): TerritoryStatistics => {
    const territoryAgents = agents.filter(a => a.territory === territory);
    const territoryCollections = collections.filter(c => 
      territoryAgents.some(a => a.id === c.agentId)
    );
    
    return {
      territory,
      totalAgents: territoryAgents.length,
      activeAgents: territoryAgents.filter(a => a.status === 'Active').length,
      totalCollections: territoryCollections.length,
      totalAmount: territoryCollections.reduce((sum, c) => sum + c.amount, 0),
      averageCollectionAmount: territoryCollections.length > 0 ? 
        territoryCollections.reduce((sum, c) => sum + c.amount, 0) / territoryCollections.length : 0,
      successRate: territoryCollections.length > 0 ? 
        (territoryCollections.filter(c => c.status === 'Completed').length / territoryCollections.length) * 100 : 0,
      totalCustomers: 0, // Mock data
      assignedCustomers: 0, // Mock data
    };
  };

  const generateBranchReport = (branchId: string): BranchCollectionStats => {
    const branchAgents = getAgentsByBranch(branchId);
    const branchCollections = collections.filter(c => c.branchId === branchId);
    
    return {
      branchId,
      branchName: branchAgents[0]?.branchName || '',
      totalCollections: branchCollections.length,
      totalAmount: branchCollections.reduce((sum, c) => sum + c.amount, 0),
      successfulCollections: branchCollections.filter(c => c.status === 'Completed').length,
      failedCollections: branchCollections.filter(c => c.status === 'Failed').length,
      pendingCollections: branchCollections.filter(c => c.status === 'Pending').length,
      totalAgents: branchAgents.length,
      activeAgents: branchAgents.filter(a => a.status === 'Active').length,
      totalCustomers: 0, // Mock data
      assignedCustomers: 0, // Mock data
      averageCollectionAmount: branchCollections.length > 0 ? 
        branchCollections.reduce((sum, c) => sum + c.amount, 0) / branchCollections.length : 0,
      successRate: branchCollections.length > 0 ? 
        (branchCollections.filter(c => c.status === 'Completed').length / branchCollections.length) * 100 : 0,
    };
  };

  // Statistics
  const getCollectionStatistics = (): CollectionStatistics => {
    const totalCollections = collections.length;
    const totalAmount = collections.reduce((sum, c) => sum + c.amount, 0);
    const successfulCollections = collections.filter(c => c.status === 'Completed').length;
    const failedCollections = collections.filter(c => c.status === 'Failed').length;
    const pendingCollections = collections.filter(c => c.status === 'Pending').length;
    const averageCollectionAmount = totalCollections > 0 ? totalAmount / totalCollections : 0;
    const totalAgents = agents.length;
    const activeAgents = agents.filter(a => a.status === 'Active').length;
    const totalCustomers = assignments.length;
    const assignedCustomers = assignments.filter(a => a.status === 'Active').length;
    const monthlyTarget = 5000000; // Mock data
    const monthlyAchievement = totalAmount;
    const achievementPercentage = (monthlyAchievement / monthlyTarget) * 100;

    return {
      totalCollections,
      totalAmount,
      successfulCollections,
      failedCollections,
      pendingCollections,
      averageCollectionAmount,
      totalAgents,
      activeAgents,
      totalCustomers,
      assignedCustomers,
      monthlyTarget,
      monthlyAchievement,
      achievementPercentage,
    };
  };

  const getAgentStatistics = () => {
    return {
      total: agents.length,
      active: agents.filter(a => a.status === 'Active').length,
      inactive: agents.filter(a => a.status === 'Inactive').length,
      suspended: agents.filter(a => a.status === 'Suspended').length,
      averagePerformance: agents.length > 0 ? 
        agents.reduce((sum, a) => sum + a.performanceRating, 0) / agents.length : 0,
    };
  };

  const getAssignmentStatistics = () => {
    return {
      total: assignments.length,
      active: assignments.filter(a => a.status === 'Active').length,
      inactive: assignments.filter(a => a.status === 'Inactive').length,
      temporary: assignments.filter(a => a.status === 'Temporary').length,
      totalOutstanding: assignments.reduce((sum, a) => sum + a.outstandingAmount, 0),
    };
  };

  const value: FieldAgentContextType = {
    // State
    agents,
    collections,
    assignments,
    reports,
    agentPerformance,
    territoryStats,
    branchStats,
    
    // Agent actions
    addAgent,
    updateAgent,
    deleteAgent,
    getAgentById,
    getAgentsByStatus,
    getAgentsByBranch,
    
    // Collection actions
    addCollection,
    updateCollection,
    deleteCollection,
    getCollectionById,
    getCollectionsByAgent,
    getCollectionsByStatus,
    getCollectionsByDateRange,
    
    // Assignment actions
    addAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentById,
    getAssignmentsByAgent,
    getAssignmentsByCustomer,
    getAssignmentsByStatus,
    
    // Report actions
    generateCollectionReport,
    generateAgentPerformanceReport,
    generateTerritoryReport,
    generateBranchReport,
    
    // Statistics
    getCollectionStatistics,
    getAgentStatistics,
    getAssignmentStatistics,
    
    // Utility functions
    generateAgentCode,
    generateCollectionCode,
    generateAssignmentId,
    calculatePerformanceRating,
  };

  return (
    <FieldAgentContext.Provider value={value}>
      {children}
    </FieldAgentContext.Provider>
  );
};

export const useFieldAgentContext = () => {
  const context = useContext(FieldAgentContext);
  if (context === undefined) {
    throw new Error('useFieldAgentContext must be used within a FieldAgentProvider');
  }
  return context;
}; 