import { useEffect, useState } from "react";
import { addOrder, cancleOrder } from "../../services/orderService";
import { getUser } from "../../services/userService";
import { IOrder } from "../../types";

const OrderHistory = () => {
    const [userOrders, setUserOrders] = useState<IOrder[]>([]);

    const getUserInfo = async ()=>{
        const user = await getUser();
        setUserOrders(user.orderHistory);
    }

    useEffect(()=>{
        getUserInfo();
    },[]);

    const onOrderClick = () => {
        addOrder();
    } 

    const onCancelOrderClick = async (orderId: string) => {
        cancleOrder({orderId});
    }
    
    return (
        <>
        {
            userOrders && userOrders.forEach((order)=>{
                <div>
                    <div>{order.date.toDateString()}</div>
                    <div>{order.status}</div>
                    {order.status === 'Active' && <div onClick={()=>onCancelOrderClick(order._id)}>Cancel</div>}
                </div>
            })
        }
            <div onClick={onOrderClick}>place Order</div>
        </>
    )
}

export default OrderHistory;