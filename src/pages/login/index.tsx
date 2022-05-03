import { View, Image, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtIcon } from 'taro-ui';
import './index.scss';
import { useDispatch } from 'react-redux';
import { API } from '@/api';
import { useEffect, useState } from 'react';

const Index: React.FC = () => {
  const [profile, setProfile] = useState<Taro.getUserProfile.SuccessCallbackResult | undefined>(undefined);
  const [phoneCode, setPhoneCode] = useState<string | undefined>(undefined);
  useEffect(() => {
    const update = async () => {
      if (phoneCode != undefined && profile !== undefined) {
        console.log('登录');
        await dispatch({ type: 'user/login', payload: { phoneCode: phoneCode } });
        console.log('上传头像');
        await API.authClient.updateInfo(profile.userInfo.nickName, profile.userInfo.avatarUrl);
        await dispatch({ type: 'user/getCurrentUserInfo' });
        console.log(profile);
        Taro.navigateBack({ delta: 1 });
      }
    };
    update();
  }, [phoneCode, profile]);
  const dispatch = useDispatch();
  const login = async (e) => {
    setPhoneCode(e.detail.code);
  };
  const getUserProfile = async () => {
    const result = await Taro.getUserProfile({ desc: '用于获取头像和昵称' });
    setProfile(result);
  };
  return (
    <View className='main'>
      <Image className='avatar' src={'https://daveshop-taro.oss-cn-beijing.aliyuncs.com/images/my/user.png'}></Image>
      <View className='hello'>您好，新朋友</View>
      <View className='tips'>为了您的账户安全，请绑定手机号</View>
      <Button onClick={() => getUserProfile()} type='primary' className='bind-phone-btn' openType={'getPhoneNumber'} onGetPhoneNumber={(e) => login(e)}>
        <View>
          <AtIcon prefixClass='iconfont' value='weixin' size='18' color='#FFF'></AtIcon>
          <Text style={{ marginLeft: 10 }}>微信手机号一键绑定</Text>
        </View>
      </Button>
    </View>
  );
};

export default Index;
