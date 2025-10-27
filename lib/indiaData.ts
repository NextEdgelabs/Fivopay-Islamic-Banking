// India-specific data for branches and addresses

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export const CITIES_BY_STATE: Record<string, string[]> = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  'Delhi': ['New Delhi'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad'],
  // Add more states and cities as needed
};

export const BRANCH_SERVICES = [
  'Deposits',
  'Loans',
  'Credit Cards',
  'Debit Cards',
  'Forex',
  'Wealth Management',
  'Insurance',
  'Demat Services',
  'Locker Facility',
  'Online Banking',
  'Mobile Banking',
  'ATM',
];

// Default working hours
export const DEFAULT_WORKING_HOURS = {
  weekdays: '9:00 AM - 5:00 PM',
  saturday: '9:00 AM - 1:00 PM',
  sunday: 'Closed',
};

