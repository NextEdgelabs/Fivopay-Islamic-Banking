'use client';

import { useState } from 'react';
import {
  BuildingOfficeIcon,
  ChartBarIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Branch, NewBranchFormData } from './types';
import BranchStatistics from './components/BranchStatistics';
import BranchFilters from './components/BranchFilters';
import BranchTable from './components/BranchTable';
import BranchOverview from './components/BranchOverview';
import BranchPerformance from './components/BranchPerformance';
import BranchDetailsModal from './components/BranchDetailsModal';
import NewBranchModal from './components/NewBranchModal';
import EditBranchModal from './components/EditBranchModal';
import BranchReportModal from './components/BranchReportModal';
import FilterSummary from './components/FilterSummary';
import QuickFilters from './components/QuickFilters';

// Toast notification state
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Toast component
const Toast = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const bgColor = toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  
  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px]`}>
      <span>{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="ml-4 text-white hover:text-gray-200">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

// Confirmation dialog component
const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string; 
  message: string; 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default function BranchManagementPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showNewBranchModal, setShowNewBranchModal] = useState(false);
  const [showEditBranchModal, setShowEditBranchModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [branchToEdit, setBranchToEdit] = useState<Branch | null>(null);
  const [branchForReport, setBranchForReport] = useState<Branch | null>(null);
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedState, setSelectedState] = useState('All States');
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    branchId: '', 
    branchName: '',
    action: '' as 'delete' | 'suspend' | 'activate'
  });

  // Mock data for branches
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: '1',
      branchCode: 'FP001',
      branchName: 'FivoPay Main Branch',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'Andheri East, Mumbai, Maharashtra',
      pincode: '400069',
      phone: '+91 22 6789 1234',
      email: 'mumbai.main@fivopay.com',
      managerName: 'Rahul Sharma',
      managerPhone: '+91 98765 43210',
      employeeCount: 25,
      customerCount: 1850,
      totalDeposits: 125000000,
      totalLoans: 87500000,
      status: 'Active',
      establishedDate: '2020-01-15',
      lastInspection: '2024-01-10'
    },
    {
      id: '2',
      branchCode: 'FP002',
      branchName: 'FivoPay Bandra Branch',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'Bandra West, Mumbai, Maharashtra',
      pincode: '400050',
      phone: '+91 22 6789 1235',
      email: 'mumbai.bandra@fivopay.com',
      managerName: 'Priya Desai',
      managerPhone: '+91 98765 43211',
      employeeCount: 18,
      customerCount: 1420,
      totalDeposits: 98000000,
      totalLoans: 65000000,
      status: 'Active',
      establishedDate: '2020-06-20',
      lastInspection: '2024-01-08'
    },
    {
      id: '3',
      branchCode: 'FP003',
      branchName: 'FivoPay Pune Branch',
      city: 'Pune',
      state: 'Maharashtra',
      address: 'Koregaon Park, Pune, Maharashtra',
      pincode: '411001',
      phone: '+91 20 6789 1236',
      email: 'pune.main@fivopay.com',
      managerName: 'Amit Patil',
      managerPhone: '+91 98765 43212',
      employeeCount: 22,
      customerCount: 1650,
      totalDeposits: 110000000,
      totalLoans: 75000000,
      status: 'Active',
      establishedDate: '2020-09-10',
      lastInspection: '2024-01-12'
    },
    {
      id: '4',
      branchCode: 'FP004',
      branchName: 'FivoPay Delhi Branch',
      city: 'New Delhi',
      state: 'Delhi',
      address: 'Connaught Place, New Delhi',
      pincode: '110001',
      phone: '+91 11 6789 1237',
      email: 'delhi.main@fivopay.com',
      managerName: 'Sunita Gupta',
      managerPhone: '+91 98765 43213',
      employeeCount: 28,
      customerCount: 2100,
      totalDeposits: 150000000,
      totalLoans: 105000000,
      status: 'Active',
      establishedDate: '2021-03-15',
      lastInspection: '2024-01-05'
    },
    {
      id: '5',
      branchCode: 'FP005',
      branchName: 'FivoPay Hyderabad Branch',
      city: 'Hyderabad',
      state: 'Telangana',
      address: 'HITEC City, Hyderabad, Telangana',
      pincode: '500081',
      phone: '+91 40 6789 1238',
      email: 'hyderabad.main@fivopay.com',
      managerName: 'Venkat Reddy',
      managerPhone: '+91 98765 43214',
      employeeCount: 20,
      customerCount: 1320,
      totalDeposits: 85000000,
      totalLoans: 58000000,
      status: 'Active',
      establishedDate: '2021-08-20',
      lastInspection: '2024-01-15'
    },
    {
      id: '6',
      branchCode: 'FP006',
      branchName: 'FivoPay Kolkata Branch',
      city: 'Kolkata',
      state: 'West Bengal',
      address: 'Salt Lake City, Kolkata, West Bengal',
      pincode: '700064',
      phone: '+91 33 6789 1239',
      email: 'kolkata.main@fivopay.com',
      managerName: 'Subrata Das',
      managerPhone: '+91 98765 43215',
      employeeCount: 16,
      customerCount: 1180,
      totalDeposits: 72000000,
      totalLoans: 48000000,
      status: 'Under Maintenance',
      establishedDate: '2021-11-10',
      lastInspection: '2023-12-20'
    },
    {
      id: '7',
      branchCode: 'FP007',
      branchName: 'FivoPay Chennai Branch',
      city: 'Chennai',
      state: 'Tamil Nadu',
      address: 'T. Nagar, Chennai, Tamil Nadu',
      pincode: '600017',
      phone: '+91 44 6789 1240',
      email: 'chennai.main@fivopay.com',
      managerName: 'Lakshmi Krishnan',
      managerPhone: '+91 98765 43216',
      employeeCount: 21,
      customerCount: 1560,
      totalDeposits: 92000000,
      totalLoans: 64000000,
      status: 'Active',
      establishedDate: '2021-12-05',
      lastInspection: '2024-01-18'
    },
    {
      id: '8',
      branchCode: 'FP008',
      branchName: 'FivoPay Bangalore Branch',
      city: 'Bangalore',
      state: 'Karnataka',
      address: 'Koramangala, Bangalore, Karnataka',
      pincode: '560034',
      phone: '+91 80 6789 1241',
      email: 'bangalore.main@fivopay.com',
      managerName: 'Rajesh Kumar',
      managerPhone: '+91 98765 43217',
      employeeCount: 26,
      customerCount: 1920,
      totalDeposits: 135000000,
      totalLoans: 95000000,
      status: 'Active',
      establishedDate: '2022-02-14',
      lastInspection: '2024-01-22'
    },
    {
      id: '9',
      branchCode: 'FP009',
      branchName: 'FivoPay Ahmedabad Branch',
      city: 'Ahmedabad',
      state: 'Gujarat',
      address: 'Vastrapur, Ahmedabad, Gujarat',
      pincode: '380015',
      phone: '+91 79 6789 1242',
      email: 'ahmedabad.main@fivopay.com',
      managerName: 'Kiran Patel',
      managerPhone: '+91 98765 43218',
      employeeCount: 19,
      customerCount: 1380,
      totalDeposits: 88000000,
      totalLoans: 62000000,
      status: 'Active',
      establishedDate: '2022-05-20',
      lastInspection: '2024-01-14'
    },
    {
      id: '10',
      branchCode: 'FP010',
      branchName: 'FivoPay Jaipur Branch',
      city: 'Jaipur',
      state: 'Rajasthan',
      address: 'C-Scheme, Jaipur, Rajasthan',
      pincode: '302001',
      phone: '+91 141 6789 1243',
      email: 'jaipur.main@fivopay.com',
      managerName: 'Pooja Agarwal',
      managerPhone: '+91 98765 43219',
      employeeCount: 17,
      customerCount: 1240,
      totalDeposits: 76000000,
      totalLoans: 53000000,
      status: 'Active',
      establishedDate: '2022-08-15',
      lastInspection: '2024-01-09'
    },
    {
      id: '11',
      branchCode: 'FP011',
      branchName: 'FivoPay Lucknow Branch',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      address: 'Gomti Nagar, Lucknow, Uttar Pradesh',
      pincode: '226010',
      phone: '+91 522 6789 1244',
      email: 'lucknow.main@fivopay.com',
      managerName: 'Manoj Singh',
      managerPhone: '+91 98765 43220',
      employeeCount: 15,
      customerCount: 1120,
      totalDeposits: 68000000,
      totalLoans: 47000000,
      status: 'Active',
      establishedDate: '2022-11-10',
      lastInspection: '2024-01-16'
    },
    {
      id: '12',
      branchCode: 'FP012',
      branchName: 'FivoPay Chandigarh Branch',
      city: 'Chandigarh',
      state: 'Punjab',
      address: 'Sector 17, Chandigarh, Punjab',
      pincode: '160017',
      phone: '+91 172 6789 1245',
      email: 'chandigarh.main@fivopay.com',
      managerName: 'Simran Kaur',
      managerPhone: '+91 98765 43221',
      employeeCount: 14,
      customerCount: 980,
      totalDeposits: 58000000,
      totalLoans: 40000000,
      status: 'Active',
      establishedDate: '2023-01-25',
      lastInspection: '2024-01-20'
    },
    {
      id: '13',
      branchCode: 'FP013',
      branchName: 'FivoPay Bhubaneswar Branch',
      city: 'Bhubaneswar',
      state: 'Odisha',
      address: 'Patia, Bhubaneswar, Odisha',
      pincode: '751024',
      phone: '+91 674 6789 1246',
      email: 'bhubaneswar.main@fivopay.com',
      managerName: 'Santosh Mohanty',
      managerPhone: '+91 98765 43222',
      employeeCount: 12,
      customerCount: 850,
      totalDeposits: 52000000,
      totalLoans: 36000000,
      status: 'Active',
      establishedDate: '2023-04-10',
      lastInspection: '2024-01-11'
    },
    {
      id: '14',
      branchCode: 'FP014',
      branchName: 'FivoPay Indore Branch',
      city: 'Indore',
      state: 'Madhya Pradesh',
      address: 'Vijay Nagar, Indore, Madhya Pradesh',
      pincode: '452010',
      phone: '+91 731 6789 1247',
      email: 'indore.main@fivopay.com',
      managerName: 'Ravi Sharma',
      managerPhone: '+91 98765 43223',
      employeeCount: 18,
      customerCount: 1340,
      totalDeposits: 82000000,
      totalLoans: 57000000,
      status: 'Active',
      establishedDate: '2023-06-20',
      lastInspection: '2024-01-07'
    },
    {
      id: '15',
      branchCode: 'FP015',
      branchName: 'FivoPay Kochi Branch',
      city: 'Kochi',
      state: 'Kerala',
      address: 'Ernakulam, Kochi, Kerala',
      pincode: '682011',
      phone: '+91 484 6789 1248',
      email: 'kochi.main@fivopay.com',
      managerName: 'Priya Nair',
      managerPhone: '+91 98765 43224',
      employeeCount: 16,
      customerCount: 1180,
      totalDeposits: 71000000,
      totalLoans: 49000000,
      status: 'Active',
      establishedDate: '2023-09-15',
      lastInspection: '2024-01-13'
    },
    {
      id: '16',
      branchCode: 'FP016',
      branchName: 'FivoPay Guwahati Branch',
      city: 'Guwahati',
      state: 'Assam',
      address: 'Fancy Bazaar, Guwahati, Assam',
      pincode: '781001',
      phone: '+91 361 6789 1249',
      email: 'guwahati.main@fivopay.com',
      managerName: 'Dipankar Baruah',
      managerPhone: '+91 98765 43225',
      employeeCount: 11,
      customerCount: 720,
      totalDeposits: 45000000,
      totalLoans: 31000000,
      status: 'Active',
      establishedDate: '2023-11-08',
      lastInspection: '2024-01-19'
    },
    {
      id: '17',
      branchCode: 'FP017',
      branchName: 'FivoPay Mysore Branch',
      city: 'Mysore',
      state: 'Karnataka',
      address: 'Saraswathipuram, Mysore, Karnataka',
      pincode: '570009',
      phone: '+91 821 6789 1250',
      email: 'mysore.main@fivopay.com',
      managerName: 'Suresh Gowda',
      managerPhone: '+91 98765 43226',
      employeeCount: 13,
      customerCount: 920,
      totalDeposits: 56000000,
      totalLoans: 39000000,
      status: 'Active',
      establishedDate: '2023-12-20',
      lastInspection: '2024-01-17'
    },
    {
      id: '18',
      branchCode: 'FP018',
      branchName: 'FivoPay Nashik Branch',
      city: 'Nashik',
      state: 'Maharashtra',
      address: 'College Road, Nashik, Maharashtra',
      pincode: '422005',
      phone: '+91 253 6789 1251',
      email: 'nashik.main@fivopay.com',
      managerName: 'Deepak Kulkarni',
      managerPhone: '+91 98765 43227',
      employeeCount: 14,
      customerCount: 1080,
      totalDeposits: 65000000,
      totalLoans: 45000000,
      status: 'Active',
      establishedDate: '2024-01-12',
      lastInspection: '2024-01-21'
    },
    {
      id: '19',
      branchCode: 'FP019',
      branchName: 'FivoPay Vadodara Branch',
      city: 'Vadodara',
      state: 'Gujarat',
      address: 'Alkapuri, Vadodara, Gujarat',
      pincode: '390007',
      phone: '+91 265 6789 1252',
      email: 'vadodara.main@fivopay.com',
      managerName: 'Nisha Shah',
      managerPhone: '+91 98765 43228',
      employeeCount: 15,
      customerCount: 1150,
      totalDeposits: 69000000,
      totalLoans: 48000000,
      status: 'Active',
      establishedDate: '2024-01-15',
      lastInspection: '2024-01-23'
    },
    {
      id: '20',
      branchCode: 'FP020',
      branchName: 'FivoPay Coimbatore Branch',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      address: 'RS Puram, Coimbatore, Tamil Nadu',
      pincode: '641002',
      phone: '+91 422 6789 1253',
      email: 'coimbatore.main@fivopay.com',
      managerName: 'Murali Krishnan',
      managerPhone: '+91 98765 43229',
      employeeCount: 17,
      customerCount: 1290,
      totalDeposits: 78000000,
      totalLoans: 54000000,
      status: 'Active',
      establishedDate: '2024-01-18',
      lastInspection: '2024-01-24'
    }
  ]);

  // Get unique states
  const states = ['All States', ...Array.from(new Set(branches.map(branch => branch.state)))];
  
  // Get cities based on selected state
  const getAvailableCities = () => {
    if (selectedState === 'All States') {
      return ['All Cities', ...Array.from(new Set(branches.map(branch => branch.city)))];
    } else {
      const stateCities = branches
        .filter(branch => branch.state === selectedState)
        .map(branch => branch.city);
      return ['All Cities', ...Array.from(new Set(stateCities))];
    }
  };
  
  const cities = getAvailableCities();

  // Filter branches based on selected filters and search term
  const filteredBranches = branches.filter(branch => {
    const matchesCity = selectedCity === 'All Cities' || branch.city === selectedCity;
    const matchesState = selectedState === 'All States' || branch.state === selectedState;
    const matchesSearch = searchTerm === '' || 
      branch.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.branchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.managerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCity && matchesState && matchesSearch;
  });



  // Toast functions
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Confirmation dialog functions
  const openConfirm = (id: string, name: string, action: 'delete' | 'suspend' | 'activate') => {
    setConfirmDialog({ isOpen: true, branchId: id, branchName: name, action });
  };

  const handleConfirmAction = () => {
    const { action, branchName } = confirmDialog;
    
    if (action === 'delete') {
      setBranches(prevBranches => prevBranches.filter(branch => branch.id !== confirmDialog.branchId));
      addToast(`Branch "${branchName}" has been deleted successfully`, 'success');
    } else if (action === 'suspend') {
      setBranches(prevBranches => 
        prevBranches.map(branch => 
          branch.id === confirmDialog.branchId 
            ? { ...branch, status: 'Inactive' as const }
            : branch
        )
      );
      addToast(`Branch "${branchName}" has been suspended successfully`, 'success');
    } else if (action === 'activate') {
      setBranches(prevBranches => 
        prevBranches.map(branch => 
          branch.id === confirmDialog.branchId 
            ? { ...branch, status: 'Active' as const }
            : branch
        )
      );
      addToast(`Branch "${branchName}" has been activated successfully`, 'success');
    }
    
    setConfirmDialog({ isOpen: false, branchId: '', branchName: '', action: 'delete' });
  };

  // Generate unique branch code
  const generateBranchCode = () => {
    const existingCodes = branches.map(branch => branch.branchCode);
    let newCode = `FP${String(branches.length + 1).padStart(3, '0')}`;
    let counter = 1;
    
    while (existingCodes.includes(newCode)) {
      newCode = `FP${String(branches.length + 1 + counter).padStart(3, '0')}`;
      counter++;
    }
    
    return newCode;
  };

  // Handle new branch creation
  const handleNewBranchSubmit = (data: NewBranchFormData) => {
    try {
      // Generate unique ID and branch code
      const newId = String(branches.length + 1);
      const branchCode = generateBranchCode();
      
      // Create new branch object
      const newBranch: Branch = {
        id: newId,
        branchCode,
        branchName: data.branchName,
        city: data.city,
        state: data.state,
        address: data.address,
        pincode: data.pincode,
        phone: data.phone,
        email: data.email,
        managerName: data.managerName,
        managerPhone: data.managerPhone,
        employeeCount: 0,
        customerCount: 0,
        totalDeposits: 0,
        totalLoans: 0,
        status: 'Active',
        establishedDate: new Date().toISOString().split('T')[0],
        lastInspection: new Date().toISOString().split('T')[0]
      };

      // Add to branches state
      setBranches(prevBranches => [...prevBranches, newBranch]);
      
      // Close modal and show success toast
      setShowNewBranchModal(false);
      addToast(`Branch "${data.branchName}" has been created successfully`, 'success');
      
    } catch (error) {
      addToast('Failed to create branch. Please try again.', 'error');
    }
  };

  // Handle branch actions
  const handleViewBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowBranchModal(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setBranchToEdit(branch);
    setShowEditBranchModal(true);
  };

  const handleGenerateReport = (branch: Branch) => {
    setBranchForReport(branch);
    setShowReportModal(true);
  };

  const handleSaveBranch = (updatedBranch: Branch) => {
    setBranches(prevBranches => 
      prevBranches.map(branch => 
        branch.id === updatedBranch.id ? updatedBranch : branch
      )
    );
    setShowEditBranchModal(false);
    setBranchToEdit(null);
    addToast(`Branch "${updatedBranch.branchName}" has been updated successfully`, 'success');
  };

  const handleExportData = () => {
    console.log('Exporting branch data');
    // Here you would implement data export functionality
  };

  // Handle state change and reset city if needed
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    if (state === 'All States') {
      setSelectedCity('All Cities');
    } else {
      // Check if current city exists in the new state
      const stateCities = branches
        .filter(branch => branch.state === state)
        .map(branch => branch.city);
      if (!stateCities.includes(selectedCity) && selectedCity !== 'All Cities') {
        setSelectedCity('All Cities');
      }
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedState('All States');
    setSelectedCity('All Cities');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Branch Management</h1>
            <p className="text-gray-600 mt-1">Manage bank branches across cities and states</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowNewBranchModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add New Branch</span>
            </button>
          </div>
        </div>
        
        {/* Quick Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <QuickFilters
            branches={branches}
            onStateSelect={handleStateChange}
            onCitySelect={setSelectedCity}
            currentState={selectedState}
            currentCity={selectedCity}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <BranchStatistics 
        branches={branches} 
        filteredBranches={filteredBranches} 
      />

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'State Overview', icon: ChartBarIcon },
              { id: 'branches', name: 'All Branches', icon: BuildingOfficeIcon },
              { id: 'performance', name: 'Performance', icon: ChartBarIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* State Overview Tab */}
          {activeTab === 'overview' && (
            <BranchOverview 
              branches={branches} 
              onViewBranch={handleViewBranch}
            />
          )}

          {/* All Branches Tab */}
          {activeTab === 'branches' && (
            <div className="space-y-4">
              <BranchFilters
                searchTerm={searchTerm}
                selectedState={selectedState}
                selectedCity={selectedCity}
                states={states}
                cities={cities}
                onSearchChange={setSearchTerm}
                onStateChange={handleStateChange}
                onCityChange={setSelectedCity}
                onExport={handleExportData}
                onClearFilters={handleClearFilters}
              />

              <FilterSummary
                branches={branches}
                filteredBranches={filteredBranches}
                searchTerm={searchTerm}
                selectedState={selectedState}
                selectedCity={selectedCity}
              />

              <BranchTable
                branches={filteredBranches}
                onViewBranch={handleViewBranch}
                onEditBranch={handleEditBranch}
                onGenerateReport={handleGenerateReport}
                onDeleteBranch={(branch) => openConfirm(branch.id, branch.branchName, 'delete')}
                onSuspendBranch={(branch) => openConfirm(branch.id, branch.branchName, 'suspend')}
                onActivateBranch={(branch) => openConfirm(branch.id, branch.branchName, 'activate')}
              />
            </div>
          )}

                    {/* Performance Tab */}
          {activeTab === 'performance' && (
            <BranchPerformance branches={branches} />
          )}
        </div>
      </div>

      {/* Branch Details Modal */}
      <BranchDetailsModal
        isOpen={showBranchModal}
        branch={selectedBranch}
        onClose={() => setShowBranchModal(false)}
        onEdit={handleEditBranch}
        onGenerateReport={handleGenerateReport}
      />

      {/* New Branch Modal */}
      <NewBranchModal
        isOpen={showNewBranchModal}
        onClose={() => setShowNewBranchModal(false)}
        onSubmit={handleNewBranchSubmit}
      />

      {/* Edit Branch Modal */}
      <EditBranchModal
        isOpen={showEditBranchModal}
        branch={branchToEdit}
        onClose={() => {
          setShowEditBranchModal(false);
          setBranchToEdit(null);
        }}
        onSave={handleSaveBranch}
      />

      {/* Branch Report Modal */}
      <BranchReportModal
        isOpen={showReportModal}
        branch={branchForReport}
        onClose={() => {
          setShowReportModal(false);
          setBranchForReport(null);
        }}
      />

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, branchId: '', branchName: '', action: 'delete' })}
        onConfirm={handleConfirmAction}
        title={`Confirm ${confirmDialog.action}`}
        message={`Are you sure you want to ${confirmDialog.action} the branch "${confirmDialog.branchName}"? This action cannot be undone.`}
      />
    </div>
  );
}
