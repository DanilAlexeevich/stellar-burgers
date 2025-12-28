import { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  fetchOrderByNumber,
  clearOrder
} from '../../services/slices/orderSlice';
import { Preloader } from '../ui/preloader/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import {
  selectIngredients,
  fetchIngredients
} from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const order = useSelector((state) => state.order.order);
  const isLoading = useSelector((state) => state.order.isLoading);
  const allIngredients: TIngredient[] = useSelector(selectIngredients);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }

    return () => {
      dispatch(clearOrder());
    };
  }, [number, dispatch]);

  useEffect(() => {
    if (!allIngredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, allIngredients.length]);

  const orderInfo = useMemo(() => {
    if (!order || allIngredients.length === 0) return null;

    const date = new Date(order.createdAt);

    const ingredientsInfo: Record<string, TIngredient & { count: number }> = {};

    order.ingredients.forEach((id: string) => {
      const ingredient = allIngredients.find((ing) => ing._id === id);
      if (ingredient) {
        if (ingredientsInfo[id]) {
          ingredientsInfo[id].count++;
        } else {
          ingredientsInfo[id] = { ...ingredient, count: 1 };
        }
      }
    });

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      date,
      total
    };
  }, [order, allIngredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return (
    <div className='pb-10'>
      <p className='text text_type_digits-large mb-6 text-center'>
        #{orderInfo.number}
      </p>
      <OrderInfoUI orderInfo={orderInfo} />
    </div>
  );
};
