import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/CartSection.css';

const CartSection = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/api/cart', {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setCartItems(response.data.items || []);
        setSelectedItems((response.data.items || []).map((item) => item.product._id));
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setCartItems([]);
        }
      }
    };

    fetchCart();
  }, [user, navigate]);

  const handleQuantityChange = (productId, amount) => {
    const updatedCart = cartItems.map((item) => {
      if (item.product._id === productId) {
        const newQuantity = Math.max(item.quantity + amount, 1);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5001/api/cart/remove/${itemId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setCartItems(cartItems.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.includes(item.product._id)) {
        return total + item.product.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const cartCount = cartItems.length;

  return (
    <div className="cart-pages">
      <div className="cart-header">
        <h1 className="cart-title">장바구니 ({cartCount})</h1>

        <div className="cart-header-actions">
          <input
            type="checkbox"
            checked={selectedItems.length === cartItems.length && cartItems.length > 0}
            onChange={(e) =>
              setSelectedItems(e.target.checked ? cartItems.map((item) => item.product._id) : [])
            }
          />
          <span>전체선택</span>

          <span className="header-action-link" onClick={() => setSelectedItems([])}>
            선택삭제
          </span>

          <span className="header-action-link" onClick={() => setCartItems([])}>
            장바구니 비우기
          </span>
        </div>
      </div>

      <div className="cart-container">
        <div className="cart-items-section">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.product._id)}
                  onChange={() => handleSelectItem(item.product._id)}
                />

                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="cart-item-image"
                />

                <div className="cart-item-details">
                  <h3>{item.product.name}</h3>
                  <p className="cart-item-options">{item.product.options || '옵션 없음'}</p>
                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.product._id, -1)}
                      >
                        -
                      </button>
                      <span className="quantity-num">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.product._id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <p className="cart-item-price">{item.product.price.toLocaleString()}원</p>

                <button
                  className="remove-item-btn"
                  onClick={() => handleRemoveItem(item._id)}
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <p>장바구니가 비어 있습니다.</p>
          )}
        </div>

        <div className="cart-summary-section">
          <h2>주문 요약</h2>
          <div className="summary-details">
            <p>
              상품 금액 <span>{calculateTotal().toLocaleString()}원</span>
            </p>
            <p>
              배송비 <span>무료</span>
            </p>
            <h3>
              결제 예정 금액 <span>{calculateTotal().toLocaleString()}원</span>
            </h3>
          </div>
          <button className="checkout-btn">전체상품 주문하기</button>
          <button className="checkout-btn secondary">선택상품 주문하기</button>
        </div>
      </div>
    </div>
  );
};

export default CartSection;