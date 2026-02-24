import ingredientsReducer from './ingredientsSlice';
import { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice extraReducers', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 200,
      price: 100,
      image: 'bun.jpg',
      image_large: 'bun-large.jpg',
      image_mobile: 'bun-mobile.jpg'
    },
    {
      _id: '2',
      name: 'Котлета',
      type: 'main',
      proteins: 20,
      fat: 15,
      carbohydrates: 5,
      calories: 300,
      price: 150,
      image: 'main.jpg',
      image_large: 'main-large.jpg',
      image_mobile: 'main-mobile.jpg'
    }
  ];

  it('pending → isLoading = true, error = null', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  it('fulfilled → isLoading = false, ingredients = payload', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('rejected → isLoading = false, error = payload (или fallback)', () => {
    const customError = 'Ингридиенты не загрузились(';

    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.rejected.type,
      payload: customError,
      error: { message: 'some error' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(customError);
    expect(state.ingredients).toEqual([]);
  });

  it('rejected без payload → error = fallback строка', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.rejected.type,
      payload: undefined,
      error: { message: 'Network error' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
    expect(state.ingredients).toEqual([]);
  });
});
