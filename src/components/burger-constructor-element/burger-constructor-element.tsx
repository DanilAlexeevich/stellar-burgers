import { FC, memo } from 'react';
import { useDispatch } from '../../services/store';
import {
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from '../../services/slices/constructorSlice';

import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleClose = () => {
      dispatch(removeIngredient(index));
    };

    const handleMoveUp = () => {
      dispatch(moveIngredientUp(index));
    };

    const handleMoveDown = () => {
      dispatch(moveIngredientDown(index));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems} // передаём, чтобы UI знал, можно ли двигать
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
