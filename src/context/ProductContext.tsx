'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, 
  ProductCategory, 
  BankingMode, 
  ProductStatus, 
  ProductFilters, 
  ProductStats,
  CreateProductData,
  UpdateProductData,
  ProductTemplate,
  DEFAULT_PRODUCT_TEMPLATES
} from '@/types/products';
import { useBankingMode } from './BankingModeContext';

interface ProductContextType {
  // Products
  products: Product[];
  filteredProducts: Product[];
  
  // CRUD Operations
  addProduct: <T extends Product>(product: CreateProductData<T>) => string;
  updateProduct: <T extends Product>(id: string, updates: UpdateProductData<T>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  
  // Filtering and Search
  setFilters: (filters: ProductFilters) => void;
  clearFilters: () => void;
  searchProducts: (query: string) => void;
  
  // Category-specific operations
  getProductsByCategory: (category: ProductCategory) => Product[];
  getProductsByBankingMode: (mode: BankingMode) => Product[];
  getActiveProducts: () => Product[];
  
  // Statistics
  getProductStats: () => ProductStats;
  
  // Templates
  templates: ProductTemplate[];
  createFromTemplate: (templateId: string, customizations?: Partial<Product>) => string;
  
  // Banking mode integration
  getAvailableProducts: () => Product[];
  isProductCompatible: (product: Product, mode: BankingMode) => boolean;
  
  // Loading states
  loading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
  const { currentMode } = useBankingMode();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFiltersState] = useState<ProductFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with default products from templates
  useEffect(() => {
    const initializeProducts = () => {
      const savedProducts = localStorage.getItem('fivopay_products');
      if (savedProducts) {
        try {
          const parsedProducts = JSON.parse(savedProducts);
          setProducts(parsedProducts);
          setFilteredProducts(parsedProducts);
        } catch (err) {
          console.error('Error parsing saved products:', err);
          createDefaultProducts();
        }
      } else {
        createDefaultProducts();
      }
    };

    initializeProducts();
  }, []);

  // Save products to localStorage whenever products change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('fivopay_products', JSON.stringify(products));
    }
  }, [products]);

  // Apply filters whenever products or filters change
  useEffect(() => {
    applyFilters();
  }, [products, filters, currentMode]);

  const createDefaultProducts = () => {
    const defaultProducts: Product[] = [
      // Islamic Banking Products
      {
        id: 'prod-1',
        name: 'Personal Financing (Murabaha)',
        description: 'Sharia-compliant personal financing based on cost-plus principle',
        category: 'loans',
        bankingMode: 'ethical',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        isDefault: true,
        tags: ['Islamic', 'Sharia Compliant', 'Personal'],
        loanType: 'Murabaha',
        minAmount: 50000,
        maxAmount: 1000000,
        profitRate: 12,
        tenure: '6-36 months',
        applications: 156,
        disbursed: 89,
        isShariaCompliant: true,
        shariaBoardApproval: true,
        profitLossSharing: false,
        noInterest: true
      },
      {
        id: 'prod-2',
        name: 'Home Financing (Musharakah)',
        description: 'Partnership-based home financing following Islamic principles',
        category: 'loans',
        bankingMode: 'ethical',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        isDefault: true,
        tags: ['Islamic', 'Sharia Compliant', 'Home'],
        loanType: 'Musharakah',
        minAmount: 1000000,
        maxAmount: 50000000,
        profitRate: 8,
        tenure: '60-240 months',
        applications: 234,
        disbursed: 167,
        isShariaCompliant: true,
        shariaBoardApproval: true,
        profitLossSharing: true,
        noInterest: true
      },
      {
        id: 'prod-3',
        name: 'Islamic Savings Account (Wadiah)',
        description: 'Safe custody account with profit sharing',
        category: 'deposits',
        bankingMode: 'ethical',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        isDefault: true,
        tags: ['Islamic', 'Sharia Compliant', 'Savings'],
        depositType: 'Wadiah',
        minAmount: 1000,
        profitRate: 4,
        accounts: 2847,
        totalDeposits: 18700000,
        isShariaCompliant: true,
        shariaBoardApproval: true,
        profitLossSharing: true,
        noInterest: true
      },
      {
        id: 'prod-4',
        name: 'Health Takaful',
        description: 'Mutual health insurance following Islamic principles',
        category: 'insurance',
        bankingMode: 'ethical',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        isDefault: true,
        tags: ['Islamic', 'Sharia Compliant', 'Health'],
        insuranceType: 'Takaful',
        premium: 250,
        coverage: 50000,
        subscribers: 1250,
        isShariaCompliant: true,
        takafulModel: 'Mudarabah',
        profitLossSharing: true
      },
      // Conventional Banking Products
      {
        id: 'prod-5',
        name: 'Personal Loan',
        description: 'Traditional personal loan with competitive interest rates',
        category: 'loans',
        bankingMode: 'conventional',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        isDefault: true,
        tags: ['Conventional', 'Personal'],
        loanType: 'Personal',
        minAmount: 50000,
        maxAmount: 1000000,
        interestRate: 12,
        tenure: '6-36 months',
        applications: 200,
        disbursed: 120,
        interestBased: true,
        creditScoring: true,
        regulatoryCompliant: true
      },
      {
        id: 'prod-6',
        name: 'Home Loan',
        description: 'Mortgage loan for home purchase',
        category: 'loans',
        bankingMode: 'conventional',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        isDefault: true,
        tags: ['Conventional', 'Home'],
        loanType: 'Home',
        minAmount: 1000000,
        maxAmount: 50000000,
        interestRate: 8,
        tenure: '60-240 months',
        applications: 300,
        disbursed: 200,
        interestBased: true,
        collateralRequired: true,
        regulatoryCompliant: true
      },
      {
        id: 'prod-7',
        name: 'Savings Account',
        description: 'Traditional savings account with interest',
        category: 'deposits',
        bankingMode: 'conventional',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        isDefault: true,
        tags: ['Conventional', 'Savings'],
        depositType: 'Savings Account',
        minAmount: 1000,
        interestRate: 4,
        accounts: 3500,
        totalDeposits: 25000000,
        interestBased: true,
        regulatoryCompliant: true
      },
      {
        id: 'prod-8',
        name: 'Health Insurance',
        description: 'Traditional health insurance coverage',
        category: 'insurance',
        bankingMode: 'conventional',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        isDefault: true,
        tags: ['Conventional', 'Health'],
        insuranceType: 'Health',
        premium: 250,
        coverage: 50000,
        subscribers: 1500,
        interestBased: false,
        regulatoryCompliant: true
      }
    ];

    setProducts(defaultProducts);
    setFilteredProducts(defaultProducts);
  };

  const generateId = (): string => {
    return `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filter by banking mode
    if (currentMode) {
      filtered = filtered.filter(product => 
        product.bankingMode === currentMode || product.bankingMode === 'both'
      );
    }

    // Apply other filters
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter(product => product.status === filters.status);
    }

    if (filters.isShariaCompliant !== undefined) {
      filtered = filtered.filter(product => 
        'isShariaCompliant' in product ? product.isShariaCompliant === filters.isShariaCompliant : true
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(product => 
        product.tags && filters.tags!.some(tag => product.tags!.includes(tag))
      );
    }

    setFilteredProducts(filtered);
  };

  const addProduct = <T extends Product>(productData: CreateProductData<T>): string => {
    const id = generateId();
    const now = new Date().toISOString();
    
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: now,
      updatedAt: now,
      createdBy: 'current_user', // This should come from auth context
      updatedBy: 'current_user'
    } as Product;

    setProducts(prev => [...prev, newProduct]);
    return id;
  };

  const updateProduct = <T extends Product>(id: string, updates: UpdateProductData<T>): void => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...updates, updatedAt: new Date().toISOString(), updatedBy: 'current_user' }
        : product
    ));
  };

  const deleteProduct = (id: string): void => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProduct = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const setFilters = (newFilters: ProductFilters): void => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = (): void => {
    setFiltersState({});
  };

  const searchProducts = (query: string): void => {
    setFilters({ search: query });
  };

  const getProductsByCategory = (category: ProductCategory): Product[] => {
    return products.filter(product => product.category === category);
  };

  const getProductsByBankingMode = (mode: BankingMode): Product[] => {
    return products.filter(product => 
      product.bankingMode === mode || product.bankingMode === 'both'
    );
  };

  const getActiveProducts = (): Product[] => {
    return products.filter(product => product.status === 'active');
  };

  const getProductStats = (): ProductStats => {
    const stats: ProductStats = {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.status === 'active').length,
      inactiveProducts: products.filter(p => p.status === 'inactive').length,
      draftProducts: products.filter(p => p.status === 'draft').length,
      byCategory: {
        loans: products.filter(p => p.category === 'loans').length,
        deposits: products.filter(p => p.category === 'deposits').length,
        investments: products.filter(p => p.category === 'investments').length,
        insurance: products.filter(p => p.category === 'insurance').length,
        accounts: products.filter(p => p.category === 'accounts').length
      },
      byBankingMode: {
        ethical: products.filter(p => p.bankingMode === 'ethical').length,
        conventional: products.filter(p => p.bankingMode === 'conventional').length,
        both: products.filter(p => p.bankingMode === 'both').length
      },
      byStatus: {
        active: products.filter(p => p.status === 'active').length,
        inactive: products.filter(p => p.status === 'inactive').length,
        draft: products.filter(p => p.status === 'draft').length,
        archived: products.filter(p => p.status === 'archived').length
      }
    };

    return stats;
  };

  const createFromTemplate = (templateId: string, customizations?: Partial<Product>): string => {
    const template = DEFAULT_PRODUCT_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template with id ${templateId} not found`);
    }

    const productData: CreateProductData<Product> = {
      ...template.template,
      ...customizations
    } as CreateProductData<Product>;

    return addProduct(productData);
  };

  const getAvailableProducts = (): Product[] => {
    return getProductsByBankingMode(currentMode);
  };

  const isProductCompatible = (product: Product, mode: BankingMode): boolean => {
    return product.bankingMode === mode || product.bankingMode === 'both';
  };

  const contextValue: ProductContextType = {
    products,
    filteredProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    setFilters,
    clearFilters,
    searchProducts,
    getProductsByCategory,
    getProductsByBankingMode,
    getActiveProducts,
    getProductStats,
    templates: DEFAULT_PRODUCT_TEMPLATES,
    createFromTemplate,
    getAvailableProducts,
    isProductCompatible,
    loading,
    error
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext(): ProductContextType {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
}

// Hook to get products filtered by current banking mode
export function useBankingModeProducts() {
  const { currentMode } = useBankingMode();
  const { getProductsByBankingMode } = useProductContext();
  
  return getProductsByBankingMode(currentMode);
}

// Hook to get products by category for current banking mode
export function useProductsByCategory(category: ProductCategory) {
  const { getProductsByCategory, getProductsByBankingMode } = useProductContext();
  const { currentMode } = useBankingMode();
  
  const allCategoryProducts = getProductsByCategory(category);
  return allCategoryProducts.filter(product => 
    product.bankingMode === currentMode || product.bankingMode === 'both'
  );
}
