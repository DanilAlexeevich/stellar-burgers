import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from './constructorSlice';
import { TIngredient } from '@utils-types';

describe('constructorSlice редьюсер', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TIngredient = {
    _id: 'bun-1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 200,
    price: 100,
    image: 'bun.jpg',
    image_large: 'bun-large.jpg',
    image_mobile: 'bun-mobile.jpg'
  };

  const mockMain1: TIngredient = {
    _id: 'main-1',
    name: 'Котлета',
    type: 'main',
    proteins: 20,
    fat: 15,
    carbohydrates: 5,
    calories: 300,
    price: 150,
    image: 'main.jpg',
    image_large: 'main-large.jpg',
    image_mobile: 'main-mobile.jpg'
  };

  const mockMain2: TIngredient = {
    _id: 'main-2',
    name: 'Огурчик',
    type: 'main',
    proteins: 1,
    fat: 0,
    carbohydrates: 3,
    calories: 20,
    price: 30,
    image: 'cucumber.jpg',
    image_large: 'cucumber-large.jpg',
    image_mobile: 'cucumber-mobile.jpg'
  };

  it('должен возвращать начальное состояние при неизвестном экшене', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('addBun → добавляет булку', () => {
    const state = constructorReducer(initialState, addBun(mockBun));

    expect(state.bun).toEqual(mockBun);
    expect(state.ingredients).toEqual([]);
  });

  it('addIngredient → добавляет ингредиент в конец списка', () => {
    const state1 = constructorReducer(initialState, addIngredient(mockMain1));
    expect(state1.ingredients).toHaveLength(1);
    expect(state1.ingredients[0]).toEqual(mockMain1);

    const state2 = constructorReducer(state1, addIngredient(mockMain2));
    expect(state2.ingredients).toHaveLength(2);
    expect(state2.ingredients[1]).toEqual(mockMain2);
  });

  it('removeIngredient → удаляет ингредиент по индексу', () => {
    let state = constructorReducer(initialState, addIngredient(mockMain1));
    state = constructorReducer(state, addIngredient(mockMain2));

    expect(state.ingredients).toHaveLength(2);

    state = constructorReducer(state, removeIngredient(0));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockMain2);
  });

  it('moveIngredientUp → меняет местами элемент с предыдущим', () => {
    let state = constructorReducer(initialState, addIngredient(mockMain1));
    state = constructorReducer(state, addIngredient(mockMain2));

    state = constructorReducer(state, moveIngredientUp(1));

    expect(state.ingredients[0]).toEqual(mockMain2);
    expect(state.ingredients[1]).toEqual(mockMain1);
  });

  it('moveIngredientUp → не меняет порядок, если индекс 0', () => {
    let state = constructorReducer(initialState, addIngredient(mockMain1));
    state = constructorReducer(state, addIngredient(mockMain2));

    const before = state.ingredients;

    state = constructorReducer(state, moveIngredientUp(0));

    expect(state.ingredients).toEqual(before);
  });

  it('moveIngredientDown → меняет местами элемент со следующим', () => {
    let state = constructorReducer(initialState, addIngredient(mockMain1));
    state = constructorReducer(state, addIngredient(mockMain2));

    state = constructorReducer(state, moveIngredientDown(0));

    expect(state.ingredients[0]).toEqual(mockMain2);
    expect(state.ingredients[1]).toEqual(mockMain1);
  });

  it('clearConstructor → очищает конструктор полностью', () => {
    let state = constructorReducer(initialState, addBun(mockBun));
    state = constructorReducer(state, addIngredient(mockMain1));

    state = constructorReducer(state, clearConstructor());

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});
