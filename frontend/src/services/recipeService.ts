import api from '@/services/api/axiosInstance';

export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
  summary?: string;
  dishTypes?: string[];
  diets?: string[];
}

export interface RecipeSearchResponse {
  results: Recipe[];
  offset: number;
  number: number;
  totalResults: number;
}

export interface RecipeSearchFilters {
  query?: string;
  cuisine?: string;
  diet?: string;
  intolerances?: string;
  type?: string;
  maxReadyTime?: number;
  number?: number;
  offset?: number;
  applyUserPreferences?: boolean;
}

const recipeService = {
  async search(filters: RecipeSearchFilters = {}): Promise<RecipeSearchResponse> {
    const response = await api.get<RecipeSearchResponse>('/recipes/search', {
      params: filters,
    });
    return response.data;
  },

  async getById(id: number, includeNutrition: boolean = false): Promise<{ recipe: any }> {
    const response = await api.get<{ recipe: any }>(`/recipes/${id}`, {
      params: { includeNutrition },
    });
    return response.data;
  },

  async getFavorites(): Promise<{ results: Recipe[] }> {
    const response = await api.get<{ results: Recipe[] }>('/recipes/favorites');
    return response.data;
  },

  async toggleFavorite(recipeId: number, title: string, image?: string): Promise<{ favorited: boolean }> {
    const response = await api.post<{ favorited: boolean }>('/recipes/favorites/toggle', {
      recipeId,
      title,
      image,
    });
    return response.data;
  },

  async getFavoriteIds(): Promise<number[]> {
    const response = await api.get<number[]>('/recipes/favorites/ids');
    return response.data;
  },
};

export default recipeService;



