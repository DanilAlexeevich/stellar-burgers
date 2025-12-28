import React, { FC } from 'react';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  done: 'Выполнен',
  pending: 'Готовится',
  created: 'Создан'
};

const statusColor: { [key: string]: string } = {
  done: '#00CCCC',
  pending: '#E52B1A',
  created: '#F2F2F3'
};

export const OrderStatus: FC<{ status: string }> = ({ status }) => {
  const text = statusText[status] || 'Отменён';
  const textStyle = statusColor[status] || '#F2F2F3';

  return <OrderStatusUI textStyle={textStyle} text={text} />;
};
