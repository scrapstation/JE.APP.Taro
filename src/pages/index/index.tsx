import { View, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { API } from '../../api/index'
import { CategoryReponse } from 'src/api/client'
import './index.scss'

const Index: React.FC = () => {
  const [categoriesRawData, setCategoriesRawData] = useState<CategoryReponse[]>(
    [],
  )
  const [categories, setCategories] = useState<
    Array<CategoryReponse & { top: number }>
  >([])
  const [currentCategoryId, setCurrentCategoryId] = useState<string>('')
  const [productsScrollTop, setProductsScrollTop] = useState<number>(0)
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await API.categoryClient.getAllCategory()
      console.log('fetch data')
      setCategoriesRawData(data)
      setCurrentCategoryId(data[0].id)
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    console.log('next')
    calcSize()
  }, [categoriesRawData])
  const calcSize = () => {
    console.log('call')
    console.log(categoriesRawData.length)
    let h = 0
    // let View = uni.createSelectorQuery().select('#ads')
    // View.fields({
    //   size: true
    // }, data => {
    //   h += Math.floor(data.height)
    // }).exec()
    let categoriesTemp = JSON.parse(JSON.stringify(categoriesRawData))
    categoriesTemp.forEach((item) => {
      let View = Taro.createSelectorQuery().select(`#products-${item.id}`)
      View.fields(
        {
          size: true,
        },
        (data) => {
          console.log(data)
          item.top = h
          h += Math.floor(data.height)
          item.bottom = h
        },
      ).exec()
    })
    setCategories(categoriesTemp)
  }
  const handleMenuSelected = (id: string) => {
    setProductsScrollTop(categories.find((item) => item.id == id)!.top)
    Taro.nextTick(() => setCurrentCategoryId(id))
  }
  return (
    <View className='container'>
      <View className='main'>
        <ScrollView className='menu-bar' scrollY scrollWithAnimation>
          <View className='wrapper'>
            {categoriesRawData.map((category) => {
              return (
                <View
                  className={`menu-item ${
                    currentCategoryId == category.id ? 'active' : ''
                  }`}
                  onClick={() => handleMenuSelected(category.id)}
                  key={category.id}
                >
                  {/* <image :src="category.category_image_url" className="image" mode="widthFix"></image> */}
                  <View className='title'>{category.name}</View>
                </View>
              )
            })}
          </View>
        </ScrollView>
        <ScrollView
          className='product-section'
          scrollY
          scrollWithAnimation
          scrollTop={productsScrollTop}
          onScroll={() => {}}
        >
          <View className='wrapper'>
            {categories.map((category) => {
              return (
                <View
                  className='products-list'
                  key={category.id}
                  id={`products-${category.id}`}
                >
                  <View className='category-name'>{category.name}</View>
                  <View className='products'>
                    {category.products!.map((product) => {
                      return (
                        <View className='product' key={product.id}>
                          <Image
                            src={product.imgUrl!}
                            mode='widthFix'
                            className='image'
                          ></Image>
                          <View className='content'>
                            <View className='name'>{product.name}</View>
                            <View className='labels'>
                              {product.attributes!.map((attribute) => {
                                return (
                                  <View className='label' key={attribute.id}>
                                    {attribute.name}
                                  </View>
                                )
                              })}
                            </View>
                            <View className='description'>
                              {product.description || ''}
                            </View>
                            <View className='price'>
                              <View>￥{product.price}</View>
                            </View>
                          </View>
                        </View>
                      )
                    })}
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

export default Index
