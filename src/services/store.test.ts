import { rootReducer } from './store';

describe('rootReducer — правильная инициализация', () => {
  it('инициализируется без ошибок и возвращает объект с нужными ключами', () => {
    const state = rootReducer(undefined as never, { type: '@@INIT' });

    expect(state).toBeDefined();
    expect(typeof state).toBe('object');

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('constructor');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('userOrders');
    expect(state).toHaveProperty('order');
    expect(typeof state.constructor).toBe('function');
  });

  it('не ломается на неизвестном экшене', () => {
    const state1 = rootReducer(undefined as never, { type: '@@INIT' });
    const state2 = rootReducer(state1, { type: 'SOME_UNKNOWN_ACTION' });

    expect(state2).toEqual(state1);
  });
});