import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Кеширование товаров с React Query
export const useOptimizedProducts = (options = {}) => {
  const {
    category = null,
    search = null,
    minPrice = null,
    maxPrice = null,
    sortBy = null,
    enabled = true
  } = options;

  // Создаем ключ для кеширования
  const queryKey = ['products', { category, search, minPrice, maxPrice, sortBy }];

  const fetchProducts = async () => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (minPrice) params.append('min_price', minPrice);
    if (maxPrice) params.append('max_price', maxPrice);
    if (sortBy) params.append('sort_by', sortBy);

    const response = await axios.get(`${API}/products?${params}`);
    return response.data;
  };

  const {
    data: products = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery(queryKey, fetchProducts, {
    enabled,
    staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими
    cacheTime: 10 * 60 * 1000, // 10 минут - время хранения в кеше
    refetchOnWindowFocus: false, // Не обновлять при фокусе окна
    refetchOnMount: false, // Не обновлять при монтировании если есть кеш
    retry: 3, // Повторить 3 раза при ошибке
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Экспоненциальная задержка
  });

  return {
    products,
    loading,
    error: error?.message,
    refetch
  };
};

// Предзагрузка товаров для улучшения UX
export const usePrefetchProducts = () => {
  const queryClient = useQueryClient();

  const prefetchProducts = async (options = {}) => {
    const {
      category = null,
      search = null,
      minPrice = null,
      maxPrice = null,
      sortBy = null
    } = options;

    const queryKey = ['products', { category, search, minPrice, maxPrice, sortBy }];

    await queryClient.prefetchQuery(queryKey, async () => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      if (minPrice) params.append('min_price', minPrice);
      if (maxPrice) params.append('max_price', maxPrice);
      if (sortBy) params.append('sort_by', sortBy);

      const response = await axios.get(`${API}/products?${params}`);
      return response.data;
    });
  };

  return { prefetchProducts };
};

// Кеширование категорий
export const useOptimizedCategories = () => {
  const fetchCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    return response.data.categories;
  };

  const {
    data: categories = [],
    isLoading: loading,
    error
  } = useQuery(['categories'], fetchCategories, {
    staleTime: 15 * 60 * 1000, // 15 минут - категории меняются редко
    cacheTime: 30 * 60 * 1000, // 30 минут в кеше
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  return {
    categories,
    loading,
    error: error?.message
  };
};

// Кеширование статистики категорий
export const useOptimizedCategoryStats = () => {
  const fetchCategoryStats = async () => {
    const response = await axios.get(`${API}/categories/stats`);
    return response.data.category_stats;
  };

  const {
    data: categoryStats = {},
    isLoading: loading,
    error
  } = useQuery(['categoryStats'], fetchCategoryStats, {
    staleTime: 10 * 60 * 1000, // 10 минут
    cacheTime: 20 * 60 * 1000, // 20 минут в кеше
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  return {
    categoryStats,
    loading,
    error: error?.message
  };
};