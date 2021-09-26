import { StatusEnum } from '../../../src/api/client';

const getStatusText = (orderStatus: StatusEnum) => {
  let status = '';
  switch (orderStatus) {
    case StatusEnum.PendingPayment:
      status = '待支付';
      break;
    case StatusEnum.PendingPack:
      status = '待打包';
      break;
    case StatusEnum.Packing:
      status = '打包中';
      break;
    case StatusEnum.PenddingDelivery:
      status = '待配送';
      break;
    case StatusEnum.Delivering:
      status = '配送中';
      break;
    case StatusEnum.Completed:
      status = '已完成';
      break;
    case StatusEnum.Canceled:
      status = '已取消';
      break;
    default:
      break;
  }
  return status;
};

export default getStatusText;
