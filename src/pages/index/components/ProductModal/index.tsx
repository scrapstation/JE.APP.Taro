import { View, Image, Swiper, SwiperItem, ScrollView } from "@tarojs/components"
import { useState } from "react"
import { ProductReponse } from "src/api/client"
import { AtModal } from "taro-ui"
import Action from "../Action"

const ProductModal: React.FC = () => {
    const [isOpened, setIsOpened] = useState<boolean>(true)
    const [product, setProduct] = useState<ProductReponse>(new ProductReponse());
    return (
        <AtModal isOpened={isOpened} >
            <View className="header">
                <Image src="/static/Images/index/menupopup_btn_share_normal.png"></Image>
                <Image src="/static/Images/index/round_close_btn.png" onClick={() => setIsOpened(false)}></Image>
            </View>
            <Swiper duration={1000} indicator-dots className="swiper" autoplay interval={3000}>
                <SwiperItem className="swiper-item">
                    <Image src={product.imgUrl!} className="w-100 h-100"></Image>
                </SwiperItem>
            </Swiper>
            <ScrollView scroll-y className="content">
                <View className="wrapper">
                    <View className="title">{product.name}</View>
                    <View className="labels">
                        {
                            product.attributes?.map(attribute => {
                                return (
                                    <View className="label" style="{color: label.label_color, background: $util.hexToRgba(label.label_color, 0.2)}">
                                        {attribute.name}
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View className="mb-10">产品描述</View>
                    <View className="mb-20">{product.description}</View>
                    {
                        product.attributes?.map(attribute => {
                            return (
                                <View className="materials">
                                    <View className="group-name">{attribute.name}</View>
                                    <View className="values">
                                        {
                                            attribute.attributeItems!.map(attributeItem => {
                                                return (
                                                    <View className="value" onClick={() => { }}>
                                                        {attributeItem.name}
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </ScrollView >
            <View className="bottom" style="{height: !productData.is_single ? '250rpx' : '200rpx'}">
                <View className="d-flex align-items-center">
                    <View className="price-and-materials">
                        <View className="price">￥{product.price}</View>
                        {/* <View className="materials" v-show="getProductSelectedMaterials">{ getProductSelectedMaterials }</View> */}
                    </View>
                    {/* <Action number="productData.number" @add="add" @minus="minus"></Action> */}
                </View>
                {/* <button type="primary" className="add-cart-btn" @tap="addToCart" > 加入购物袋</button > */}
            </View >
        </AtModal >
    )
}
export default ProductModal