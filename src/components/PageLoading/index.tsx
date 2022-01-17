import { Image, View } from '@tarojs/components';
import loadingGif from '/src/static/images/components/loading4.gif';

type EmptyPropType = {
  marginTop?: number;
  text?: string;
  iconSrc?: string;
};
const PageLoading: React.FC<EmptyPropType> = () => {
  return (
    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
      <Image src={loadingGif} style={{ width: 150, height: 150 }} />
    </View>
  );
};

export default PageLoading;
