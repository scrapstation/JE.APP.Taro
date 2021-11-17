import { StatusEnumOfOrder } from '../../../src/api/client';

const getStatusText = (orderStatus: StatusEnumOfOrder) => {
  let status = '';
  switch (orderStatus) {
    case StatusEnumOfOrder.PendingPayment:
      status = '待支付';
      break;
    case StatusEnumOfOrder.PendingPack:
      status = '待打包';
      break;
    case StatusEnumOfOrder.Packing:
      status = '打包中';
      break;
    case StatusEnumOfOrder.PenddingDelivery:
      status = '待配送';
      break;
    case StatusEnumOfOrder.Delivering:
      status = '配送中';
      break;
    case StatusEnumOfOrder.Completed:
      status = '已完成';
      break;
    case StatusEnumOfOrder.Canceled:
      status = '已取消';
      break;
    default:
      break;
  }
  return status;
};

export default getStatusText;
