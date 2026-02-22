import { useSelector, useDispatch } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '@ui';

export const ConstructorPage = () => {
  const { isLoading, error } = useSelector((state) => state.ingredients);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className='text text_type_main-large text_color_error mt-30'>
        Ошибка: {error}
      </p>
    );
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
