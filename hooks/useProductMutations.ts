import { useState } from 'react';
import { productService, CreateProductDto, UpdateProductDto } from '@/services/products';

export function useProductMutations() {
  const [loading, setLoading] = useState(false);

  const createProduct = async (data: CreateProductDto) => {
    setLoading(true);
    try {
      const newProduct = await productService.createProduct(data);
      return newProduct;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, data: UpdateProductDto) => {
    setLoading(true);
    try {
      const updatedProduct = await productService.updateProduct(id, data);
      return updatedProduct;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      await productService.deleteProduct(id);
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
  };
}
