import orderReducer, { fetchOrderByNumber, clearOrder } from './orderSlice';
import { TOrder } from '@utils-types';

describe('orderSlice редьюсер', () => {
  const initialState = {
    order: null,
    isLoading: false,
    error: null
  };

  const mockOrder: TOrder = {
    _id: 'order123',
    ingredients: ['bun1', 'main1', 'bun1'],
    status: 'done',
    name: 'Краторный бургер',
    createdAt: '2025-02-23T12:00:00.000Z',
    updatedAt: '2025-02-23T12:05:00.000Z',
    number: 54321
  };

  it('возвращает начальное состояние при неизвестном экшене', () => {
    const state = orderReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('fetchOrderByNumber.pending → isLoading = true, error = null', () => {
    const state = orderReducer(initialState, {
      type: fetchOrderByNumber.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.order).toBeNull();
  });

  it('fetchOrderByNumber.fulfilled → isLoading = false, order = payload', () => {
    const state = orderReducer(initialState, {
      type: fetchOrderByNumber.fulfilled.type,
      payload: mockOrder
    });

    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  it('fetchOrderByNumber.rejected → isLoading = false, error = payload или fallback', () => {
    const customError = 'Заказ не найден';

    const state = orderReducer(initialState, {
      type: fetchOrderByNumber.rejected.type,
      payload: customError,
      error: { message: 'not found' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(customError);
    expect(state.order).toBeNull();
  });

  it('fetchOrderByNumber.rejected без payload → error = fallback строка', () => {
    const state = orderReducer(initialState, {
      type: fetchOrderByNumber.rejected.type,
      payload: undefined,
      error: { message: 'server error' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
    expect(state.order).toBeNull();
  });

  it('clearOrder → очищает order', () => {
    let state = orderReducer(initialState, {
      type: fetchOrderByNumber.fulfilled.type,
      payload: mockOrder
    });

    expect(state.order).toEqual(mockOrder);

    state = orderReducer(state, clearOrder());

    expect(state.order).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});
