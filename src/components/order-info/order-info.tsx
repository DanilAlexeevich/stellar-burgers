import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  fetchOrderByNumber,
  clearOrder
} from '../../services/slices/orderSlice';
import { Preloader } from '../ui/preloader/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const order = useSelector((state) => state.order.order);
  const isLoading = useSelector((state) => state.order.isLoading);
  const allIngredients = useSelector(selectIngredients);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }

    return () => {
      dispatch(clearOrder());
    };
  }, [number, dispatch]);

  const orderInfo = useMemo(() => {
    if (!order || !allIngredients.length) return null;

    const date = new Date(order.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = allIngredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo: ingredientsInfo,
      date,
      total
    };
  }, [order, allIngredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
