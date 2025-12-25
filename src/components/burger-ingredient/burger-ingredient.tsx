import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { addBun, addIngredient } from '../../services/slices/constructorSlice';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const constructorItems = useSelector((state) => state.constructor);

    const ingredients = constructorItems.ingredients ?? []; // Защита от undefined

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        dispatch(addIngredient(ingredient));
      }
    };
    const rawCount =
      ingredient.type === 'bun'
        ? constructorItems.bun?._id === ingredient._id
          ? 2
          : 0
        : ingredients.filter(
            (item: { _id: string }) => item._id === ingredient._id
          ).length;

    const commonProps = {
      ingredient,
      locationState: { background: location },
      handleAdd
    };

    if (rawCount >= 0) {
      return <BurgerIngredientUI {...commonProps} count={rawCount} />;
    }

    return <BurgerIngredientUI {...commonProps} count={0} />;
  }
);
