import { View, Image, Swiper, SwiperItem, ScrollView, Button } from "@tarojs/components"
import { useEffect, useState } from "react"
import { ProductReponse } from "src/api/client"
import { AtButton, AtModal } from "taro-ui"
import { CardItem } from "../.."
import Action from "../Action"
import "./index.scss"

export type ProductModalProps = {
    product: ProductReponse;
    onClose: () => void;
    onAddToCart: (cartItem: CardItem) => void;
}
const ProductModal: React.FC<ProductModalProps> = (props) => {
    const [attributeSelectedInfo, setAttributeSelectedInfo] = useState<{ attributeId: string, attributeItemId: string }[]>([]);
    const [cartItem, setCartItem] = useState<CardItem>({
        productId: props.product.id,
        skuId: '',
        productName: props.product.name!,
        skuPrice: 0,
        number: 1,
        image: props.product.imgUrl!
    })

    const handleAttributeSelectedChange = (attributeId: string, attributeItemId: string) => {
        let attributeSelectedInfoTemp = attributeSelectedInfo.map(x => Object.assign({}, x));
        const attributeItemIndex = attributeSelectedInfoTemp.findIndex(x => x.attributeId === attributeId);
        attributeSelectedInfoTemp[attributeItemIndex].attributeItemId = attributeItemId;
        setAttributeSelectedInfo(attributeSelectedInfoTemp)
    }

    useEffect(() => {
        setAttributeSelectedInfo(props.product.attributes!.map(x => { return { attributeId: x.id, attributeItemId: x.attributeItems![0].id } }))
    }, [])

    useEffect(() => {
        if (attributeSelectedInfo.length == 0) {
            return
        }
        setCartItem({
            ...cartItem,
            skuId: props.product.skus!.filter(x => x.attributeItemIds?.sort().toString() === attributeSelectedInfo.map(x => x.attributeItemId).sort().toString())![0].id,
            skuPrice: props.product.skus!.filter(x => x.attributeItemIds?.sort().toString() === attributeSelectedInfo.map(x => x.attributeItemId).sort().toString())![0].price
        })
    }, [attributeSelectedInfo])

    const handleOnAdd = () => {
        setCartItem({ ...cartItem, number: cartItem.number + 1 })
    }
    const handleOnMinus = () => {
        if (cartItem.number <= 1) {
            return
        }
        setCartItem({ ...cartItem, number: cartItem.number - 1 })
    }

    const getSkuInfo = () => {
        let allAttributeItems = props.product.attributes!.map(x => x.attributeItems!).flat()
        let allSelectedAttributeItemIds = attributeSelectedInfo.map(x => x.attributeItemId)
        return allAttributeItems
            .filter(x => allSelectedAttributeItemIds.findIndex(attributeItemId => attributeItemId == x.id) != -1)
            .map(x => `${x.name} `)
    }

    const handleAddToCart = () => {
        props.onAddToCart(cartItem)
    }

    return (
        <>
            <View className="header">
                <Image src={require('../../../../static/Images/index/round_close_btn.png')} onClick={() => props.onClose()}></Image>
            </View>
            <Swiper duration={1000} indicator-dots className="swiper" autoplay interval={3000}>
                <SwiperItem className="swiper-item">
                    <Image src={props.product.imgUrl!} className="w-100 h-100"></Image>
                </SwiperItem>
            </Swiper>
            <ScrollView scroll-y className="content">
                <View className="wrapper">
                    <View className="title">{props.product.name}</View>
                    <View className="labels">
                        {
                            props.product.attributes?.map(attribute => {
                                return (
                                    <View className="label" style="{color: label.label_color, background: $util.hexToRgba(label.label_color, 0.2)}">
                                        {attribute.name}
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View className="mb-10">产品描述</View>
                    <View className="mb-20">{props.product.description}</View>
                    {
                        props.product.attributes?.map(attribute => {
                            return (
                                <View className="materials">
                                    <View className="group-name">{attribute.name}</View>
                                    <View className="values">
                                        {
                                            attribute.attributeItems!.map(attributeItem => {
                                                return (
                                                    <View className={attributeSelectedInfo.map(x => x.attributeItemId).findIndex(id => id == attributeItem.id) !== -1 ? 'value selected' : "value"} onClick={() => handleAttributeSelectedChange(attribute.id, attributeItem.id)}>
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
                <View className="cart-item-info">
                    <View className="price-and-materials">
                        <View className="price">￥{cartItem.skuPrice}</View>
                        <View className="materials" >{getSkuInfo()}</View>
                    </View>
                    <Action isMultiSku={false} number={cartItem.number} onAdd={() => handleOnAdd()} onMinus={() => handleOnMinus()} onSelectMaterails={() => { }}></Action>
                </View>
                <Button type="primary" className="add-cart-btn" onClick={() => handleAddToCart()}>加入购物袋</Button>
            </View >
        </>
    )
}
export default ProductModal