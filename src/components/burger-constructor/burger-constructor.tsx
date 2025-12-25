import { FC, useMemo, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { orderBurgerApi } from '../../utils/burger-api';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { selectUser } from '../../services/slices/userSlice';
import { TOrder } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const constructorItems = useSelector((state) => state.constructor);

  const [orderRequest, setOrderRequest] = useState(false);
  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);

  const bun = constructorItems.bun;
  const ingredients = constructorItems.ingredients;

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum: number, item: any) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const onOrderClick = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }

    if (!bun) {
      alert('Добавьте булку!');
      return;
    }

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    setOrderRequest(true);

    try {
      const response = await orderBurgerApi(ingredientsIds);
      setOrderModalData(response.order);
      dispatch(clearConstructor());
    } catch (err) {
      console.error('Ошибка оформления заказа:', err);
      alert('Не удалось оформить заказ. Попробуйте позже.');
    } finally {
      setOrderRequest(false);
    }
  };

  const closeOrderModal = () => {
    setOrderModalData(null);
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
