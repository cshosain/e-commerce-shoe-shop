import React, { useEffect, useState } from "react";
import axios from "axios";
import "./orders.scss";
import { useNavigate } from "react-router-dom";

interface OrderItem {
    productId: string;
    title: string;
    img: string;
    price: number;
    size: string;
    color: string;
    quantity: number;
    _id: string;
}

interface PaymentMethod {
    methodName: string;
    payStatus: boolean;
}

interface ShippingInformation {
    firstName: string;
    lastName: string;
    address: string;
    postalCode: string;
    city: string;
    phone: string;
    deliveryMethod: string;
    deliveryLocation: string;
}

interface Order {
    _id: string;
    userId: string;
    items: OrderItem[];
    paymentMethod: PaymentMethod;
    shippingInformation: ShippingInformation;
    totalAmount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    useEffect(() => {
        axios.get(`${baseUrl}/api/user/orders`, {
            withCredentials: true,
        })
            .then(res => {
                setOrders(res.data.orders || []);
            })
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, [baseUrl]);
    const navigate = useNavigate();

    return (
        <div className="orders-page">
            <h1>Your Orders</h1>
            {loading ? (
                <div className="orders-loading">Loading your orders...</div>
            ) : orders.length === 0 ? (
                <div className="orders-empty">No orders found.</div>
            ) : (
                <div className="orders-table-wrapper">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Shipping Info</th>
                                <th>Payment</th>
                                <th>Items</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td className="order-id">{order._id.slice(-8).toUpperCase()}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`order-status ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="shipping-table-info">
                                            <div><b>{order.shippingInformation.firstName} {order.shippingInformation.lastName}</b></div>
                                            <div>{order.shippingInformation.address}, {order.shippingInformation.city} {order.shippingInformation.postalCode}</div>
                                            <div>Phone: {order.shippingInformation.phone}</div>
                                            <div>Delivery: {order.shippingInformation.deliveryMethod}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="payment-table-info">
                                            <div>Method: <b>{order.paymentMethod.methodName.toUpperCase()}</b></div>
                                            <div>Status: <b>{order.paymentMethod.payStatus ? "Paid" : "Unpaid"}</b></div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="items-table-list">
                                            {order.items.map(item => (
                                                <div className="item-table-row" key={item._id}>
                                                    <img onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/product/${item.productId}`);
                                                    }} className="item-img" src={item.img} alt={item.title} />
                                                    <div>
                                                        <div className="item-title">{item.title}</div>
                                                        <div className="item-attr">Size: <span>{item.size}</span> | Color: <span>{item.color}</span></div>
                                                        <div className="item-attr">Qty: <span>{item.quantity}</span></div>
                                                        <div className="item-price">${item.price}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="order-total">${order.totalAmount}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Orders;