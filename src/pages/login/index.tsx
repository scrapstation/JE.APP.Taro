import { View, Image, Swiper, SwiperItem, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtAvatar, AtIcon } from 'taro-ui';
import './index.scss';
import defaultUserAvator from '/src/static/images/my/user.png';
const Index: React.FC = () => {
  return (
    <View className='main'>
      <Image className='avatar' src={defaultUserAvator}></Image>
      <View className='hello'>您好，茶茶</View>
      <View className='tips'>为了您的账户安全，请绑定手机号</View>

      <Button type='primary' className='bind-phone-btn'>
        <View>
          <AtIcon prefixClass='iconfont' value='weixin' size='18' color='#FFF'></AtIcon>
          <Text style={{ marginLeft: 10 }}>微信手机号一键绑定</Text>
        </View>
      </Button>
    </View>
  );
};

export default Index;
