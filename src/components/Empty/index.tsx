import { Image, View } from '@tarojs/components';

type EmptyPropType = {
  marginTop?: number;
  text?: string;
  iconSrc?: string;
};
const Empty: React.FC<EmptyPropType> = (props) => {
  return (
    <View style={{ marginTop: props.marginTop ?? 100, textAlign: 'center' }}>
      <Image src={props.iconSrc ?? 'https://daveshop-taro.oss-cn-beijing.aliyuncs.com/images/my/rider/empty.svg'} style={{ width: 80, height: 80 }} />
      <View style={{ color: '#8a8a8a' }}>{props.text ?? '空空如也'}</View>
    </View>
  );
};

export default Empty;
