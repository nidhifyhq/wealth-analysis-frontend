import React from 'react';
import './AssetsCard.css';

const CreditCardBills = () => {
  const bills = [
    {
      id: 1,
      bank: 'HDFC Millenia',
      logo: 'https://placehold.co/40x40/red/white?text=H', 
      amount: '₹42,387.12',
      status: 'Due in 3 days',
      statusType: 'danger'
    },
    {
      id: 2,
      bank: 'Axis Rewards',
      logo: 'https://placehold.co/40x40/maroon/white?text=A', 
      amount: '₹92,012.70',
      status: 'Due on 28 Feb',
      statusType: 'neutral'
    },
    {
      id: 3,
      bank: '+ 2 more',
      logo: 'https://placehold.co/40x40/059669/white?text=+', 
      amount: '₹71,091.25',
      status: null,
      statusType: null
    }
  ];

  return (
    <div className="finance-app-container">
      <div className="bills-card">
        {bills.map((bill, index) => (
          <div key={bill.id} className={`bill-row ${index === bills.length - 1 ? 'last' : ''}`}>
            <div className="bill-info">
              <img src={bill.logo} alt={bill.bank} className="bank-logo" />
              <span className="bank-name">{bill.bank}</span>
            </div>
            <div className="bill-amount-container">
              <span className="bill-amount">{bill.amount}</span>
            </div>
          </div>
        ))}
        {/* The decorative cutout */}
       
      </div>

      <div className="footer-summary">
         <div className="cutout-container">
          <div className="cutout-circle"></div>
        </div>
                <div className="summary-item">
          <span className="summary-label">Total asset value</span>
          <span className="summary-value total">₹2,05,491.07</span>
        </div>
        <div className="summary-item text-right">
          <span className="summary-label">CREDIT CARDS</span>
          <span className="summary-value">3 Bills Due</span>
        </div>
      </div>
    </div>
  );
};

export default CreditCardBills;
