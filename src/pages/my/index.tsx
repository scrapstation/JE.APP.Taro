import { View, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import './index.scss'

const My: React.FC = () => {
  const [categories, setCategories] = useState<{ id: string, name: string, top: number }[]>([{ id: '1', name: '1', top: 0 }, { id: '2', name: '2', top: 0 }])
  const [currentCategoryId, setCurrentCategoryId] = useState<string>('')
  const [productsScrollTop, setProductsScrollTop] = useState<number>(0)
  useEffect(() => {
    setCategories([{ id: '1', name: '1', top: 0 }, { id: '2', name: '2', top: 0 }])
    setCurrentCategoryId('1')
    calcSize()
  }, [])
  const calcSize = () => {
    let h = 0
    // let view = uni.createSelectorQuery().select('#ads')
    // view.fields({
    //   size: true
    // }, data => {
    //   h += Math.floor(data.height)
    // }).exec()
    let categoriesTemp = JSON.parse(JSON.stringify(categories))
    categoriesTemp.forEach(item => {
      let view = Taro.createSelectorQuery().select(`#products-${item.id}`)
      view.fields({
        size: true
      }, data => {
        item.top = h
        h += Math.floor(data.height)
        item.bottom = h
      }).exec()
    })
    debugger
    setCategories(categoriesTemp)
  }
  const handleMenuSelected = (id: string) => {
    setProductsScrollTop(categories.find(item => item.id == id)!.top)
    Taro.nextTick(() => setCurrentCategoryId(id))
  }
  return (
    <View className='container'>
      <View className='main'>
        <ScrollView className='menu-bar' scrollY scrollWithAnimation >
          <View className='wrapper'>
            {categories.map(category => {
              return (
                <View className={`menu-item ${currentCategoryId == category.id ? 'active' : ''}`} onClick={() => handleMenuSelected(category.id)} key={category.id}>
                  {/* <image :src="category.category_image_url" class="image" mode="widthFix"></image> */}
                  <View className='title'>{category.name}
                  </View>
                </View>
              )
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export default My;
