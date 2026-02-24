import userOrdersReducer from './userOrdersSlice';
import { fetchUserOrders } from './userOrdersSlice';
import { TOrder } from '@utils-types';

describe('userOrdersSlice extraReducers', () => {
  const initialState = {
    orders: [],
    isLoading: false,
    error: null
  };

  const mockUserOrders: TOrder[] = [
    {
      _id: 'userorder1',
      ingredients: ['bun1', 'main1', 'bun1'],
      status: 'done',
      name: 'Мой бургер 1',
      createdAt: '2025-02-23T14:00:00.000Z',
      updatedAt: '2025-02-23T14:05:00.000Z',
      number: 70001
    },
    {
      _id: 'userorder2',
      ingredients: ['bun2', 'sauce1'],
      status: 'created',
      name: 'Мой бургер 2',
      createdAt: '2025-02-23T15:00:00.000Z',
      updatedAt: '2025-02-23T15:00:00.000Z',
      number: 70002
    }
  ];

  it('pending → isLoading = true, error = null', () => {
    const state = userOrdersReducer(initialState, {
      type: fetchUserOrders.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual([]);
  });

  it('fulfilled → isLoading = false, orders = payload', () => {
    const state = userOrdersReducer(initialState, {
      type: fetchUserOrders.fulfilled.type,
      payload: mockUserOrders
    });

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockUserOrders);
    expect(state.error).toBeNull();
  });

  it('rejected → isLoading = false, error = payload или fallback', () => {
    const customError = 'Не удалось загрузить заказы';

    const state = userOrdersReducer(initialState, {
      type: fetchUserOrders.rejected.type,
      payload: customError,
      error: { message: 'auth error' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(customError);
    expect(state.orders).toEqual([]);
  });

  it('rejected без payload → error = fallback строка', () => {
    const state = userOrdersReducer(initialState, {
      type: fetchUserOrders.rejected.type,
      payload: undefined,
      error: { message: 'token expired' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
    expect(state.orders).toEqual([]);
  });
});
