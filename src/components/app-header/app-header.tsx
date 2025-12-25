import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeader: FC = () => (
  <header className='p-4 pb-4 pt-4'>
    <nav className='container'>
      <div
        className='display-flex'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', gap: '40px' }}>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `text text_type_main-default ${isActive ? 'text_color_primary' : 'text_color_inactive'}`
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
          >
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <span className='ml-2'>Конструктор</span>
              </>
            )}
          </NavLink>

          <NavLink
            to='/feed'
            className={({ isActive }) =>
              `text text_type_main-default ${isActive ? 'text_color_primary' : 'text_color_inactive'}`
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <span className='ml-2'>Лента заказов</span>
              </>
            )}
          </NavLink>
        </div>

        <div>
          <NavLink to='/'>
            <Logo className={''} />
          </NavLink>
        </div>

        <div>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `text text_type_main-default ${isActive ? 'text_color_primary' : 'text_color_inactive'}`
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
          >
            {({ isActive }) => (
              <>
                <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                <span className='ml-2'>Личный кабинет</span>
              </>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  </header>
);
