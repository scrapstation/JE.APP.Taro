import { View, Image, Navigator, Button, ButtonProps } from '@tarojs/components';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConnectState } from 'src/models/connect';
import { UserModelState } from 'src/models/user';
import { AtBadge, AtIcon } from 'taro-ui';
import './index.scss';
import Taro from '@tarojs/taro';

const renderListItem = (title: string, path: string, desc: string, showArrow: boolean) => {
  return (
    <Navigator url={path} style={{ padding: '20px 20px' }}>
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <View style={{ fontSize: 16, color: '#343434' }}>{title}</View>
        <View style={{ flex: 1, textAlign: 'right', fontSize: 14, color: '#C1C3C6' }}>{desc}</View>
        <View>{showArrow && <AtIcon value='chevron-right' size={14} color='#C1C3C6' customStyle={{ marginLeft: 10, verticalAlign: 'unset' }}></AtIcon>}</View>
      </View>
    </Navigator>
  );
};

const Personal: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser, isLogin } = useSelector<ConnectState, UserModelState>((x) => x.user);
  useEffect(() => {
    if (isLogin) {
      dispatch({ type: 'user/getCurrentUserInfo' });
    }
  }, [isLogin]);

  const toLogin = () => {
    Taro.navigateTo({ url: '/pages/login/index' });
  };

  return (
    <View className='container'>
      <View className='header-img'>
        <Image style={{ width: '100%' }} src={'https://daveshop-taro.oss-cn-beijing.aliyuncs.com/images/my/headerbg.png'} mode='widthFix'></Image>
      </View>
      <View className='content'>
        <View className='member-card'>
          {currentUser && (
            <View style={{ display: 'flex' }}>
              <Image className='avatar' src={currentUser?.avator ?? 'https://daveshop-taro.oss-cn-beijing.aliyuncs.com/images/my/user_default_avatar.jpg'}></Image>
              <View style={{ display: 'flex', marginLeft: 10, flexDirection: 'column', justifyContent: 'space-evenly' }}>
                <AtBadge value={'Lv1'}>
                  <View className='wenyue-font' style={{ fontSize: 20 }}>{`??????, ${currentUser?.nickName}`}</View>
                </AtBadge>
                <View style={{ fontSize: 14 }}>???????????????????????????</View>
              </View>
            </View>
          )}
          {!currentUser && (
            <View style={{ display: 'flex', alignItems: 'center' }}>
              <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                <View>???????????????????????????</View>
                <View style={{ fontSize: 12, marginTop: 10 }}>????????????????????????????????????????????????</View>
              </View>
              <View>
                <Button type='primary' size='mini' style={{ borderRadius: 50, backgroundColor: '#000' }} onClick={() => toLogin()}>
                  ????????????
                </Button>
              </View>
            </View>
          )}
          <View className='row' style={{ marginTop: 20 }}>
            <View className='grid'>
              <View className='value'>{currentUser ? 63 : '***'}</View>
              <View className='title'>????????????</View>
            </View>
            <View onClick={() => Taro.navigateTo({ url: '/pages/coupon/index' })} className='grid' hover-className='opacity-6'>
              <View className='value'>{currentUser ? currentUser.couponCount : '***'}</View>
              <View className='title'>?????????</View>
            </View>
            <View className='grid'>
              <View className='value'>{currentUser ? 0.0 : '***'}</View>
              <View className='title'>??????</View>
            </View>
          </View>
        </View>
      </View>
      <View style={{ backgroundColor: '#fff', marginBottom: 20 }}>{renderListItem('????????????', '/pages/rider/index', '', true)}</View>
      <View style={{ backgroundColor: '#fff', marginBottom: 20 }}>
        {renderListItem('????????????', '/pages/rider/index', '????????????', true)}
        {renderListItem('????????????', '', '7*24????????????', true)}
        {renderListItem('????????????', '', '', true)}
        {renderListItem('????????????', '', '????????????', true)}
        {renderListItem('????????????', '', '', false)}
      </View>
    </View>
  );
};

export default Personal;
