import Taro from '@tarojs/taro';
async function tryFetch<T>(fun: Promise<T>, showLoading) {
  try {
    if (showLoading) {
      Taro.showLoading({ title: '', mask: true });
    }
    return await fun;
  } finally {
    if (showLoading) {
      Taro.hideLoading();
    }
  }
}

export default tryFetch;
