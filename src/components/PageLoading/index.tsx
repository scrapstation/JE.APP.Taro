import { Image, View } from '@tarojs/components';

type EmptyPropType = {
  marginTop?: number;
  text?: string;
  iconSrc?: string;
};
const PageLoading: React.FC<EmptyPropType> = () => {
  return (
    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
      <Image src={'https://daveshop-taro.oss-cn-beijing.aliyuncs.com/images/components/loading.gif'} style={{ width: 150, height: 150 }} />
    </View>
  );
};

export default PageLoading;
