import { useEffect, useState } from "react";
import './ProductList.scss';
import { IOrder } from "../../../types";
import { useNavigate } from "react-router-dom";
import { getOrderList, markOrderComplete, rejectOrder } from "../../../services/adminServices/orderService";

const Product = () => {
    const [orderList, setOrderList] = useState<IOrder[]>([]);
    const navigate = useNavigate();

    useEffect(()=>{
        (async ()=>{
            const orders = await getOrderList({
                start: 0,
                limit: 50
            });
            setOrderList(orders);
        })();
    },[]);

    const onProductClick = (productId: string)=>{
        navigate(`/product/${productId}`);
    }

    const onRejectOrderClick = async (orderId: string) => {
        rejectOrder({
            orderId
        });
    }

    const onMarkOrderComplete = async (orderId: string) => {
        markOrderComplete({
            orderId
        });
    }

    return (
        <>
            {
                orderList.length !== 0  && orderList.map((order) => (
                    <>
                        <div className="cart-item">
                            {order.products.map((item) => {
                                return <div>
                                    <img src={item.product.image} onClick={() => onProductClick(item.product._id)} />
                                    <div>{item.product.name}</div>
                                    <div>{item.product.price}</div>
                                </div>;
                            })}
                            <div>{order.status}</div>
                            <div>{order.date}</div>
                            <button onClick={() => onRejectOrderClick(order._id)}>Remove</button>
                        </div><div onClick={() => onMarkOrderComplete(order._id)}>Mark Complete</div>
                    </>
                ))
            }
        </>
      );
    
}

export default Product;