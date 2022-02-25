import { View, Image, Swiper, SwiperItem, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtAvatar, AtIcon } from 'taro-ui';
import './index.scss';
import { useDispatch, useSelector } from 'react-redux';

const Index: React.FC = () => {
  const dispatch = useDispatch();
  const login = async (e) => {
    Taro.showLoading();
    await dispatch({ type: 'user/login', payload: { phoneCode: e.detail.code } });
    await dispatch({ type: 'user/getCurrentUserInfo' });
    Taro.hideLoading();
    Taro.navigateBack({ delta: 1 });
  };
  return (
    <View className='main'>
      <Image className='avatar' src={'https://daveshop-taro.oss-cn-beijing.aliyuncs.com/images/my/user.png'}></Image>
      <View className='hello'>您好，茶茶</View>
      <View className='tips'>为了您的账户安全，请绑定手机号</View>

      <Button type='primary' className='bind-phone-btn' openType={'getPhoneNumber'} onGetPhoneNumber={(e) => login(e)}>
        <View>
          <AtIcon prefixClass='iconfont' value='weixin' size='18' color='#FFF'></AtIcon>
          <Text style={{ marginLeft: 10 }}>微信手机号一键绑定</Text>
        </View>
      </Button>
    </View>
  );
};

export default Index;
