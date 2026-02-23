import feedReducer from './feedSlice';
import { fetchFeeds } from './feedSlice';
import { TOrder } from '@utils-types';

describe('feedSlice extraReducers', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
  };

  const mockOrders: TOrder[] = [
    {
      _id: 'order1',
      ingredients: ['id1', 'id2'],
      status: 'done',
      name: 'Бургер 1',
      createdAt: '2025-02-23T10:00:00.000Z',
      updatedAt: '2025-02-23T10:01:00.000Z',
      number: 12345
    },
    {
      _id: 'order2',
      ingredients: ['id3'],
      status: 'created',
      name: 'Бургер 2',
      createdAt: '2025-02-23T11:00:00.000Z',
      updatedAt: '2025-02-23T11:00:00.000Z',
      number: 12346
    }
  ];

  const mockPayload = {
    orders: mockOrders,
    total: 150,
    totalToday: 42
  };

  it('pending → isLoading = true, error = null', () => {
    const state = feedReducer(initialState, {
      type: fetchFeeds.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.totalToday).toBe(0);
  });

  it('fulfilled → isLoading = false, данные записываются полностью', () => {
    const state = feedReducer(initialState, {
      type: fetchFeeds.fulfilled.type,
      payload: mockPayload
    });

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(150);
    expect(state.totalToday).toBe(42);
    expect(state.error).toBeNull();
  });

  it('rejected → isLoading = false, error = payload (или fallback)', () => {
    const customError = 'Не удалось загрузить ленту';

    const state = feedReducer(initialState, {
      type: fetchFeeds.rejected.type,
      payload: customError,
      error: { message: 'some network error' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(customError);
    expect(state.orders).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.totalToday).toBe(0);
  });

  it('rejected без payload → error = fallback строка', () => {
    const state = feedReducer(initialState, {
      type: fetchFeeds.rejected.type,
      payload: undefined,
      error: { message: 'Server down' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
    expect(state.orders).toEqual([]);
  });
});
