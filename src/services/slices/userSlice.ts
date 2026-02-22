import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  logoutApi,
  TLoginData,
  TRegisterData,
  loginUserApi,
  registerUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';
import { RootState } from '../store';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false
};

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { rejectWithValue }) => {
    const accessToken = getCookie('accessToken');

    if (!accessToken) {
      return rejectWithValue('unauthorized');
    }

    const res = await getUserApi();
    return res.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);

    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);

    return res.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);

    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);

    return res.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export default userSlice.reducer;
