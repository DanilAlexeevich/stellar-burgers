import { FC, useEffect, useState, SyntheticEvent } from 'react';
import { ProfileUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/userSlice';
import { updateUser } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [initialValue, setInitialValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (user) {
      const initial = {
        name: user.name || '',
        email: user.email || '',
        password: ''
      };
      setFormValue(initial);
      setInitialValue(initial);
      setIsInitialized(true);
    }
  }, [user]);

  const isFormChanged =
    isInitialized &&
    (formValue.name !== initialValue.name ||
      formValue.email !== initialValue.email ||
      !!formValue.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue(initialValue);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isFormChanged) return;

    const updateData: { name?: string; email?: string; password?: string } = {};
    if (formValue.name !== initialValue.name) updateData.name = formValue.name;
    if (formValue.email !== initialValue.email)
      updateData.email = formValue.email;
    if (formValue.password) updateData.password = formValue.password;

    try {
      await dispatch(updateUser(updateData)).unwrap();

      setInitialValue({
        name: formValue.name,
        email: formValue.email,
        password: ''
      });

      setFormValue((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
    }
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleChange}
    />
  );
};
