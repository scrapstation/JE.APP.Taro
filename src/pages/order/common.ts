import { OrderStatusEnum } from '../../../src/api/client';

const getStatusText = (orderStatus: OrderStatusEnum) => {
  let status = '';
  switch (orderStatus) {
    case OrderStatusEnum.InPayment:
      status = '待支付';
      break;
    case OrderStatusEnum.InPackage:
      status = '打包中';
      break;
    case OrderStatusEnum.InDelivery:
      status = '配送中';
      break;
    case OrderStatusEnum.Completed:
      status = '已完成';
      break;
    case OrderStatusEnum.Canceled:
      status = '已取消';
      break;
    default:
      break;
  }
  return status;
};

export default getStatusText;
