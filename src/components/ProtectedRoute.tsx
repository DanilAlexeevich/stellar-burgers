import { useSelector } from '../services/store';
import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from './ui/preloader';
import {
  selectIsAuthChecked,
  selectUser
} from '../../src/services/slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean; // true — для страниц логина/регистрации
  children: React.ReactElement; // то, что рендерим, если доступ разрешён
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  // Пока идёт проверка авторизации — показываем лоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Защищённая страница
  if (!onlyUnAuth && !user) {
    // Если не авторизован — редиректим на логин и сохраняем текущий URL, чтобы после логина вернуться
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  // Страница только для неавторизованных (login, register и т.д.)
  if (onlyUnAuth && user) {
    // Если уже залогинен — редиректим туда, откуда пришли, или на главную
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // Всё ок — рендерим содержимое
  return children;
};
