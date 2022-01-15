import { Image, View } from '@tarojs/components';
import empty from '/src/static/images/my/rider/empty.svg';

type EmptyPropType = {
  marginTop?: number;
  text?: string;
  iconSrc?: string;
};
const Empty: React.FC<EmptyPropType> = (props) => {
  return (
    <View style={{ marginTop: props.marginTop ?? 100, textAlign: 'center' }}>
      <Image src={props.iconSrc ?? empty} style={{ width: 80, height: 80 }} />
      <View style={{ color: '#8a8a8a' }}>{props.text ?? '空空如也'}</View>
    </View>
  );
};

export default Empty;
