import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordApi } from '../../utils/burger-api';
import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');
    setIsLoading(true);

    try {
      await forgotPasswordApi({ email });
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    } catch (err: unknown) {
      setErrorText('Ошибка отправки. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ForgotPasswordUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
