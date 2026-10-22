import { useLocation, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const { state } = useLocation();

  return (
    <main className="order-success-page">
      <div className="order-success-card">
        <div className="order-success-icon">✅</div>
        <h1>Order Placed Successfully!</h1>
        <p className="order-success-sub">Thank you for shopping with Manroz 🎉</p>

        {state && (
          <div className="order-success-details">
            <div className="order-detail-row">
              <span>Payment ID</span>
              <span>{state.paymentId}</span>
            </div>
            <div className="order-detail-row">
              <span>Amount Paid</span>
              <span>₹{state.amount?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        <p className="order-success-note">
          You will receive a confirmation email soon. Your order will be delivered within 5-7 business days.
        </p>

        <div className="order-success-btns">
          <Link to="/account" className="btn-view-orders">View My Orders</Link>
          <Link to="/shop" className="btn-continue-shopping-success">Continue Shopping</Link>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccess;
