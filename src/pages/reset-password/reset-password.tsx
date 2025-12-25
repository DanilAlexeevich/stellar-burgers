import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '../../utils/burger-api';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');
    setIsLoading(true);

    try {
      await resetPasswordApi({ password, token });
      localStorage.removeItem('resetPassword');
      navigate('/login', { replace: true });
    } catch (err: any) {
      setErrorText(err.message || 'Ошибка сброса пароля. Проверьте код.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResetPasswordUI
      errorText={errorText}
      password={password}
      setPassword={setPassword}
      token={token}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
