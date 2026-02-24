beforeEach(() => {
  cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );
  cy.visit('http://localhost:4000');
  cy.wait('@getIngredients');
});

describe('Constructor page', () => {
  it('успешная загрузка страницы и ингредиентов', () => {
    cy.contains('Соберите бургер').should('be.visible');
    cy.contains('Краторная булка N-200i').should('exist');
  });

  it('добавляет булку в конструктор по клику', () => {
    // Находим карточку с булкой по тексту внутри
    cy.contains('булка')
      .closest('.szzp3k0uBXITrGixPLCJ') // карточка ингредиента
      .first() // берём первую подходящую
      .find('button') // кнопка добавления
      .click({ force: true });

    // Проверяем появление в конструкторе (верхняя/нижняя булка)
    cy.get('[class*="constructor"]')
      .contains('булка')
      .should('be.visible')
      .and('have.length.gte', 1);

    // Проверяем счётчик
    cy.contains('булка')
      .closest('.szzp3k0uBXITrGixPLCJ')
      .find('[class*="counter"]')
      .should('contain.text', '2');
  });
});

describe('Модальное окно ингредиента', () => {
  it('открывает модальное окно ингредиента по клику на карточку', () => {
    cy.contains('Соберите бургер', { timeout: 15000 }).should('be.visible');

    cy.get('li', { timeout: 10000 }).should('have.length.greaterThan', 0);

    cy.get('li')
      .first()
      .should('be.visible')
      .find('a')
      .click({ force: true });

    cy.get('[data-testid="modal-window"]', { timeout: 15000 })
      .should('exist')
      .should('be.visible');

    cy.contains('Калории, ккал', { timeout: 10000 }).should('be.visible');
  });

  it('закрывает модалку по клику на крестик', () => {
    // Открываем
    cy.contains('булка').closest('li').find('a').click();

    // Кликаем на крестик
    cy.get('[data-testid="modal-window"] button')
      .find('svg')
      .click({ force: true });

    // Модалка исчезла
    cy.get('[data-testid="modal-window"]').should('not.exist');

    // URL вернулся к главному
    cy.url().should('eq', 'http://localhost:4000/');
  });

  it('закрывает модалку по клику на оверлей', () => {
    // Открываем
    cy.contains('булка').closest('li').find('a').click();

    // Клик по оверлею
    cy.get('[data-testid="modal-overlay"]').click({ force: true });

    // Модалка закрыта
    cy.get('[data-testid="modal-window"]').should('not.exist');
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');

    cy.intercept('POST', '**/orders', { fixture: 'order-success.json' }).as(
      'createOrder'
    );

    cy.setCookie('accessToken', 'mocked-jwt-token-12345');

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('оформляет заказ с булкой и начинкой → показывает модалку с номером', () => {
    // 1. Добавляем булку
    cy.contains('Краторная булка N-200i')
      .closest('li')
      .find('button')
      .click({ force: true });

    // 2. Добавляем начинку
    cy.contains('Соус с шипами Антарианского плоскоходца')
      .closest('li')
      .find('button')
      .click({ force: true });

    // 3. Кликаем «Оформить заказ»
    cy.contains('Оформить заказ')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    // 4. Ждём запрос на создание заказа
    cy.wait('@createOrder')
      .its('request.body.ingredients')
      .should('be.an', 'array')
      .and('have.length.greaterThan', 2);

    // 5. Проверяем модалку заказа
    cy.get('[data-testid="modal-window"]').should('be.visible');

    // 6. Проверяем номер заказа
    cy.get('[data-testid="order-number"]').should('have.text', '54321');

    cy.contains('Ваш заказ начали готовить').should('be.visible');
  });

  it('закрывает модалку заказа по крестику → конструктор очищается', () => {
    cy.contains('Краторная булка N-200i').closest('li').find('button').click();
    cy.contains('Соус с шипами Антарианского плоскоходца')
      .closest('li')
      .find('button')
      .click();
    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');

    // Закрываем модалку
    cy.get('[data-testid="modal-window"] button')
      .find('svg')
      .click({ force: true });

    // Модалка исчезла
    cy.get('[data-testid="modal-window"]').should('not.exist');

    // Конструктор пуст
    cy.get('[data-testid="burger-constructor-container"]')
      .should('exist')
      .find('[data-testid="constructor-item"]')
      .should('have.length', 0);

    cy.get('[class*="constructor-element"]').should('have.length', 0);
  });
});
