import userReducer from './userSlice';
import {
  loginUser,
  registerUser,
  checkUserAuth,
  logoutUser,
  updateUser
} from './userSlice';
import { TUser } from '@utils-types';

describe('userSlice редьюсер', () => {
  const initialState = {
    user: null,
    isAuthChecked: false
  };

  const mockUser: TUser = {
    email: 'test@yandex.ru',
    name: 'Тестовый Юзер'
  };

  it('возвращает начальное состояние при неизвестном экшене', () => {
    const state = userReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('loginUser.fulfilled → сохраняет пользователя', () => {
    const state = userReducer(initialState, {
      type: loginUser.fulfilled.type,
      payload: mockUser
    });

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(false);
  });

  it('registerUser.fulfilled → сохраняет пользователя', () => {
    const state = userReducer(initialState, {
      type: registerUser.fulfilled.type,
      payload: mockUser
    });

    expect(state.user).toEqual(mockUser);
  });

  it('updateUser.fulfilled → обновляет пользователя', () => {
    let state = userReducer(initialState, {
      type: loginUser.fulfilled.type,
      payload: mockUser
    });

    const updatedUser = { ...mockUser, name: 'Новый Юзер' };

    state = userReducer(state, {
      type: updateUser.fulfilled.type,
      payload: updatedUser
    });

    expect(state.user).toEqual(updatedUser);
  });

  it('checkUserAuth.fulfilled → сохраняет пользователя и ставит isAuthChecked = true', () => {
    const state = userReducer(initialState, {
      type: checkUserAuth.fulfilled.type,
      payload: mockUser
    });

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('checkUserAuth.rejected → ставит isAuthChecked = true (без изменения user)', () => {
    const state = userReducer(initialState, {
      type: checkUserAuth.rejected.type,
      payload: 'unauthorized',
      error: { message: 'no token' }
    });

    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('logoutUser.fulfilled → очищает пользователя', () => {
    let state = userReducer(initialState, {
      type: loginUser.fulfilled.type,
      payload: mockUser
    });

    state = userReducer(state, {
      type: logoutUser.fulfilled.type
    });

    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(false);
  });
});
