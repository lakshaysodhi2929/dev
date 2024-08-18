import './cart.scss';
import { useEffect, useState } from "react";
import { addOrder } from "../../services/orderService";
import { getUser } from "../../services/userService";
import { IItems } from "../../types";
import { useNavigate } from "react-router-dom";
import { updateProductToCart } from "../../services/cartService";

const Cart = () => {
    const [userCart, setUserCart] = useState<IItems[]>([]);
    const navigate = useNavigate();

    const getUserInfo = async () => {
        const user = await getUser();
        setUserCart(user.cart);
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    const onOrderClick = async () => {
        await addOrder();
        await getUserInfo();
    }

    const onProductClick = (productId: string) => {
        navigate(`/product/${productId}`);
    }

    const navigateToOrdersPage = () => {
        navigate('/orders');
    } 

    const updateProductInCart = async (qty: number, productId: string) => {
        await updateProductToCart({
            productId,
            quantity: qty
        });
        await getUserInfo();
    }

    return (
        <>
            {
                userCart && userCart.map((cartItem) => (
                    <div className="cart-item">
                        <img src={cartItem.product.image} onClick={() => onProductClick(cartItem.product._id)} />
                        <div>{cartItem.product.name}</div>
                        <div>{cartItem.product.price}</div>
                        {cartItem.quantity > 0 && (
                            <div className="quantity-control">
                                <div onClick={() => updateProductInCart(cartItem.quantity + 1, cartItem.product._id)}>+</div>
                                <div>{cartItem.quantity}</div>
                                <div onClick={() => updateProductInCart(cartItem.quantity - 1, cartItem.product._id)}>-</div>
                            </div>
                        )}
                    </div>
                ))
            }
            {
                userCart.length ? <div className="place-order" onClick={onOrderClick}>Place Order</div> : <div>Cart Is Empty</div>
            }
            <div onClick={navigateToOrdersPage}>Orders Page</div>
        </>
    )
}

export default Cart;
