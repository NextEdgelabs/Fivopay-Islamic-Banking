import { 
  Product, 
  ProductCategory, 
  BankingMode, 
  ProductFilters, 
  CreateProductData, 
  UpdateProductData,
  ProductStats,
  ProductTemplate,
  DEFAULT_PRODUCT_TEMPLATES
} from '@/types/products';

// Mock API client for product operations
export class ProductService {
  private baseUrl: string;
  private mockDelay: number = 500; // Simulate network delay

  constructor(baseUrl: string = '/api/products') {
    this.baseUrl = baseUrl;
  }

  // Simulate network delay
  private async delay(ms: number = this.mockDelay): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all products
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    await this.delay();
    
    // In a real implementation, this would make an API call
    // For now, we'll return mock data from localStorage or default products
    const savedProducts = localStorage.getItem('fivopay_products');
    let products: Product[] = [];
    
    if (savedProducts) {
      try {
        products = JSON.parse(savedProducts);
      } catch (error) {
        console.error('Error parsing saved products:', error);
        products = this.getDefaultProducts();
      }
    } else {
      products = this.getDefaultProducts();
    }

    // Apply filters if provided
    if (filters) {
      products = this.applyFilters(products, filters);
    }

    return products;
  }

  // Get product by ID
  async getProduct(id: string): Promise<Product | null> {
    await this.delay();
    
    const products = await this.getProducts();
    return products.find(product => product.id === id) || null;
  }

  // Create new product
  async createProduct<T extends Product>(productData: CreateProductData<T>): Promise<Product> {
    await this.delay();
    
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: now,
      updatedAt: now,
      createdBy: 'current_user', // This should come from auth context
      updatedBy: 'current_user'
    } as Product;

    // Save to localStorage (in real app, this would be an API call)
    const existingProducts = await this.getProducts();
    const updatedProducts = [...existingProducts, newProduct];
    localStorage.setItem('fivopay_products', JSON.stringify(updatedProducts));

    return newProduct;
  }

  // Update existing product
  async updateProduct<T extends Product>(id: string, updates: UpdateProductData<T>): Promise<Product> {
    await this.delay();
    
    const products = await this.getProducts();
    const productIndex = products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      throw new Error(`Product with id ${id} not found`);
    }

    const updatedProduct: Product = {
      ...products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: 'current_user'
    };

    products[productIndex] = updatedProduct;
    localStorage.setItem('fivopay_products', JSON.stringify(products));

    return updatedProduct;
  }

  // Delete product
  async deleteProduct(id: string): Promise<boolean> {
    await this.delay();
    
    const products = await this.getProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    
    if (filteredProducts.length === products.length) {
      return false; // Product not found
    }

    localStorage.setItem('fivopay_products', JSON.stringify(filteredProducts));
    return true;
  }

  // Get products by category
  async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter(product => product.category === category);
  }

  // Get products by banking mode
  async getProductsByBankingMode(mode: BankingMode): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter(product => 
      product.bankingMode === mode || product.bankingMode === 'both'
    );
  }

  // Get active products
  async getActiveProducts(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter(product => product.status === 'active');
  }

  // Get product statistics
  async getProductStats(): Promise<ProductStats> {
    const products = await this.getProducts();
    
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
  }

  // Get product templates
  async getProductTemplates(): Promise<ProductTemplate[]> {
    await this.delay(200);
    return DEFAULT_PRODUCT_TEMPLATES;
  }

  // Create product from template
  async createFromTemplate(templateId: string, customizations?: Partial<Product>): Promise<Product> {
    const templates = await this.getProductTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error(`Template with id ${templateId} not found`);
    }

    const productData: CreateProductData<Product> = {
      ...template.template,
      ...customizations
    } as CreateProductData<Product>;

    return this.createProduct(productData);
  }

  // Search products
  async searchProducts(query: string, filters?: ProductFilters): Promise<Product[]> {
    const products = await this.getProducts(filters);
    const searchLower = query.toLowerCase();
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  }

  // Validate product data
  validateProduct<T extends Product>(productData: CreateProductData<T>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!productData.name || productData.name.trim().length === 0) {
      errors.push('Product name is required');
    }

    if (!productData.description || productData.description.trim().length === 0) {
      errors.push('Product description is required');
    }

    if (!productData.category) {
      errors.push('Product category is required');
    }

    if (!productData.bankingMode) {
      errors.push('Banking mode is required');
    }

    // Category-specific validation
    if (productData.category === 'loans') {
      const loanProduct = productData as CreateProductData<any>;
      if (!loanProduct.minAmount || loanProduct.minAmount <= 0) {
        errors.push('Minimum amount must be greater than 0 for loan products');
      }
      if (!loanProduct.maxAmount || loanProduct.maxAmount <= loanProduct.minAmount) {
        errors.push('Maximum amount must be greater than minimum amount');
      }
      if (!loanProduct.tenure || loanProduct.tenure.trim().length === 0) {
        errors.push('Tenure is required for loan products');
      }
    }

    if (productData.category === 'deposits') {
      const depositProduct = productData as CreateProductData<any>;
      if (!depositProduct.minAmount || depositProduct.minAmount <= 0) {
        errors.push('Minimum amount must be greater than 0 for deposit products');
      }
    }

    if (productData.category === 'insurance') {
      const insuranceProduct = productData as CreateProductData<any>;
      if (!insuranceProduct.premium || insuranceProduct.premium <= 0) {
        errors.push('Premium must be greater than 0 for insurance products');
      }
      if (!insuranceProduct.coverage || insuranceProduct.coverage <= 0) {
        errors.push('Coverage amount must be greater than 0 for insurance products');
      }
    }

    // Banking mode specific validation
    if (productData.bankingMode === 'ethical') {
      const hasShariaCompliance = 'isShariaCompliant' in productData && productData.isShariaCompliant;
      if (!hasShariaCompliance) {
        errors.push('Sharia compliance is required for ethical banking products');
      }
    }

    if (productData.bankingMode === 'conventional') {
      const hasInterestRate = 'interestRate' in productData && productData.interestRate !== undefined;
      const hasProfitRate = 'profitRate' in productData && productData.profitRate !== undefined;
      
      if (!hasInterestRate && !hasProfitRate) {
        errors.push('Interest rate or profit rate is required for conventional banking products');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Private helper methods
  private generateId(): string {
    return `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }

  private applyFilters(products: Product[], filters: ProductFilters): Product[] {
    let filtered = [...products];

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.bankingMode) {
      filtered = filtered.filter(product => 
        product.bankingMode === filters.bankingMode || product.bankingMode === 'both'
      );
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

    return filtered;
  }

  private getDefaultProducts(): Product[] {
    // Return the same default products as in ProductContext
    return [
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
  }
}

// Create and export service instance
export const productService = new ProductService();

// Export convenience functions
export const productApi = {
  getProducts: (filters?: ProductFilters) => productService.getProducts(filters),
  getProduct: (id: string) => productService.getProduct(id),
  createProduct: <T extends Product>(productData: CreateProductData<T>) => productService.createProduct(productData),
  updateProduct: <T extends Product>(id: string, updates: UpdateProductData<T>) => productService.updateProduct(id, updates),
  deleteProduct: (id: string) => productService.deleteProduct(id),
  getProductsByCategory: (category: ProductCategory) => productService.getProductsByCategory(category),
  getProductsByBankingMode: (mode: BankingMode) => productService.getProductsByBankingMode(mode),
  getActiveProducts: () => productService.getActiveProducts(),
  getProductStats: () => productService.getProductStats(),
  getProductTemplates: () => productService.getProductTemplates(),
  createFromTemplate: (templateId: string, customizations?: Partial<Product>) => productService.createFromTemplate(templateId, customizations),
  searchProducts: (query: string, filters?: ProductFilters) => productService.searchProducts(query, filters),
  validateProduct: <T extends Product>(productData: CreateProductData<T>) => productService.validateProduct(productData)
};
