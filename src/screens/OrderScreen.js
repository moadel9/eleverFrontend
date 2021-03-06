import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { detailsOrder, deliverOrder } from "../actions/orderActions"
import LoadingBox from "../components/LoadingBox"
import MessageBox from "../components/MessageBox"

export default function OrderScreen(props) {
  ///getting the order id from url
  const orderId = props.match.params.id

  ///getting the state of order details
  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  ///checking if admin or not to show deliver button
  const userSignin = useSelector((state) => state.userSignin)
  const { userInfo } = userSignin

  ////sending to getting specific order details action

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(detailsOrder(orderId))
  }, [dispatch, orderId])

  const deliverHandler = () => {
    dispatch(deliverOrder(order._id))
    window.location.reload() //to refresh the page look and remove the deliver button
  }

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <h1>Order No. : {order._id}</h1>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Shipping</h2>
                <p>
                  <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                  <strong>Address: </strong> {order.shippingAddress.address},{order.shippingAddress.city}, {order.shippingAddress.postalCode},{order.shippingAddress.country}
                </p>
                {order.isDelivered ? <MessageBox variant="success">Delivered at {order.deliveredAt}</MessageBox> : <MessageBox variant="danger">Not Delivered</MessageBox>}
              </div>
            </li>

            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img src={item.image} alt={item.name} className="small"></img>
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </div>

                        <div>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>${order.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>${order.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tax</div>
                  <div>${order.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong> Order Total</strong>
                  </div>
                  <div>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              {userInfo.isAdmin && order && !order.isDelivered && (
                <li>
                  <button type="button" className="primary block" onClick={deliverHandler}>
                    Deliver Order
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
