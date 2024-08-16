import { useEffect, useState } from "react";
import { addOrder } from "../../services/orderService";
import { getUser } from "../../services/userService";
import { IItems } from "../../types";
import { useNavigate } from "react-router-dom";
import { updateProductToCart } from "../../services/cartService";

//mostly flow is sync here so it's not going to work like when cart get's updated actual quantity is not going to get showup
const Cart = () => {
    const [userCart, setUserCart] = useState<IItems[]>([]);
    const navigate = useNavigate();

    const getUserInfo = async ()=>{
        const user = await getUser();
        setUserCart(user.cart);
    }

    useEffect(()=>{
        getUserInfo();
    },[]);

    const onOrderClick = () => {
        addOrder();
    } 

    const onProductClick = (productId: string) => {
        navigate(`/product/${productId}`);
    }

    const updateProductInCart = async (qty: number, productId: string)=>{
        updateProductToCart({
            productId,
            quantity: qty
        });
        await getUserInfo();
    }
    
    return (
        <>
        {
            userCart && userCart.forEach((cartItem)=>{
                <div onClick={() => onProductClick(cartItem.product._id)}>
                    <div>{cartItem.product.image}</div>
                    <div>{cartItem.product.name}</div>
                    <div>{cartItem.product.price}</div>
                    { cartItem.quantity > 0 && <>
                        <div onClick={() => updateProductInCart(cartItem.quantity+1, cartItem.product._id)}>+</div>
                        <div>{cartItem.quantity}</div>
                        <div onClick={() => updateProductInCart(cartItem.quantity-1, cartItem.product._id)}>-</div>
                    </>}
                </div>
            })
        }
            <div onClick={onOrderClick}>place Order</div>
        </>
    )
}

export default Cart;