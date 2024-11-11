import { Button, Form, Input, Card, Tabs, Table } from 'antd';
import React, { useState, useContext,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBankAccount,fetchBankAccounts,fetchTransactions } from '../Redux/BankSlice';
import { BankContext } from '../Contextapi/BankContext';
import { addAccountInDb } from '../dboperations/addaccountdb';

const Homepage = () => {
  const [showForm, setShowForm] = useState(false);
  const { addCard, cards,name,setName,fetchName} = useContext(BankContext); 
  const [accountDetails, setAccountDetails] = useState({
    bankName: '',
    cardNumber: '',
    expiryDate: '',
    phoneNumber: '',
    bankBalance: '',
    yourName: '',
  });
  const [totalBalance, setTotalBalance] = useState(0);

  const dispatch = useDispatch();
  const bankAccounts = useSelector((state) => state.bank.bankAccounts);
  const transactions = useSelector((state) => state.bank.transactions);

  useEffect(() => {
    dispatch(fetchBankAccounts());
    dispatch(fetchTransactions());
    getTotalBalance();
    fetchName();
  }, [dispatch,name]);

  const getTotalBalance = async () => {
    try {
      const url = process.env.REACT_APP_API_URL;
      const response = await fetch(url+'totalbalance/total-balance');
      if (response.ok) {
        const data = await response.json();
        setTotalBalance(data.totalUpdatedBalance);
      } else {
        console.error('Failed to fetch total balance');
      }
    } catch (error) {
      console.error('Error fetching total balance:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails({ ...accountDetails, [name]: value });
  };

  const handleFormSubmit = (values) => {
    addAccountInDb(values);
    const balance = parseFloat(values.bankBalance);
    if (isNaN(balance)) {
      alert('Invalid bank balance. Please enter a valid number.');
      return;
    }

    const newBankAccount = {
      bankName: values.bankName,
      cardNumber: values.cardNumber,
      balance: balance,
    };

    dispatch(addBankAccount(newBankAccount));

    const newCard = {
      name: values.yourName,
      cardNumber: values.cardNumber,
      expiryDate: values.expiryDate,
      bankName: values.bankName,
    };
    addCard(newCard);

    // alert(`Your Name: ${values.yourName}\nBank Name: ${values.bankName}\nCard Number: ${values.cardNumber}\nExpiry Date: ${values.expiryDate}\nPhone Number: ${values.phoneNumber}\nBank Balance: $${balance.toFixed(2)}`);

    setShowForm(false);
    setAccountDetails({
      bankName: '',
      cardNumber: '',
      expiryDate: '',
      phoneNumber: '',
      bankBalance: '',
      yourName: '',
    });
  };

  const getStatusStyles = (status) => {
    let textColor;
    let backgroundColor;

    switch (status) {
      case 'Success':
        textColor = 'green';
        backgroundColor = 'rgba(144, 238, 144, 0.5)';
        break;
      case 'Pending':
        textColor = 'red';
        backgroundColor = 'rgba(255, 182, 193, 0.5)';
        break;
      case 'Processing':
        textColor = 'blue';
        backgroundColor = 'rgba(173, 216, 230, 0.5)';
        break;
      case 'Declined':
        textColor = 'red';
        backgroundColor = 'rgba(255, 182, 193, 0.5)';
        break;
      default:
        textColor = 'black';
        backgroundColor = 'transparent';
    }

    return { textColor, backgroundColor, borderRadius: '8px' };
  };

  const getCategoryStyles = (category, index) => {
    const colors = ['green', 'blue', 'purple', 'orange'];
    const backgroundColors = ['lightgreen', 'lightblue', 'lightpurple', 'lightyellow'];

    const categoryIndex = index % colors.length;
    const textColor = colors[categoryIndex];
    const backgroundColor = backgroundColors[categoryIndex];

    return {
      color: textColor,
      backgroundColor,
      borderRadius: '8px',
      border: `2px dashed ${textColor}`,
      padding: '4px 8px',
    };
  };

  const columns = [
    { title: 'Transaction', dataIndex: 'transaction', key: 'transaction' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => {
        const { textColor, backgroundColor } = getStatusStyles(record.status);
        return (
          <span
            style={{
              color: textColor,
              backgroundColor,
              padding: '4px 8px',
              borderRadius: '8px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            ${amount}
          </span>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const { textColor, backgroundColor } = getStatusStyles(status);
        return (
          <span
            style={{
              color: textColor,
              backgroundColor,
              padding: '4px 8px',
              borderRadius: '8px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {status}
          </span>
        );
      },
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category, record, index) => {
        const styles = getCategoryStyles(category, index);
        return <span style={styles}>{category}</span>;
      },
    },
  ];

  return (
    <div style={{ display: 'flex', gap: '200px'}}>
      <div style={{ padding: '20px',width:'700px'}}>
        <h1>
          <span style={{ color: 'black' }}>Welcome</span> <span style={{ color: 'blue' }}>{name}!</span>
        </h1>
        <p>Access & manage your account and transactions efficiently</p>

        {/* Plain Card Layout for Bank Accounts */}
        <Card
          style={{ 
            marginTop: '20px', 
            backgroundColor: '#fff', // White background
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)', // Darker shadow effect
          }}
          bordered={false} // No border
        >
          <h4>{bankAccounts.length} Bank Account(s)</h4>
          <p>Total balance: <strong>${(totalBalance || 0).toFixed(2)}</strong></p>
          <Button
            onClick={() => setShowForm(true)}
            type="primary"
            style={{
              marginTop: '10px',
            }}>
            <span style={{ marginRight: '8px' }}>+</span> Add Account
          </Button>

          {showForm && (
            <Form onFinish={handleFormSubmit} style={{ marginTop: '20px' }}>
              <Form.Item
                name="yourName"
                label="Your Name"
                rules={[{ required: true, message: 'Please enter your name!' }]}>
                <Input name="yourName" onChange={handleInputChange} />
              </Form.Item>
              <Form.Item
                name="bankName"
                label="Bank Name"
                rules={[{ required: true, message: 'Please enter the bank name!' }]}>
                <Input name="bankName" onChange={handleInputChange} />
              </Form.Item>
              <Form.Item
                name="cardNumber"
                label="Card Number"
                rules={[{ required: true, message: 'Please enter your card number!' }]}>
                <Input name="cardNumber" onChange={handleInputChange} />
              </Form.Item>
              <Form.Item
                name="expiryDate"
                label="Expiry Date"
                rules={[{ required: true, message: 'Please enter the expiry date!' }]}>
                <Input name="expiryDate" onChange={handleInputChange} />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter your phone number!' }]}>
                <Input name="phoneNumber" onChange={handleInputChange} />
              </Form.Item>
              <Form.Item
                name="bankBalance"
                label="Bank Balance"
                rules={[{ required: true, message: 'Please enter the bank balance!' }]}>
                <Input name="bankBalance" onChange={handleInputChange} />
              </Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                style={{
                  marginTop: '10px',
                }}>
                Submit
              </Button>
            </Form>
          )}
        </Card>

        <h2 style={{ marginTop: '20px' }}>Recent Transactions</h2>
        <Tabs defaultActiveKey="1">
          {bankAccounts.map((account) => {
            const filteredTransactions = transactions.filter(
              (transaction) => transaction.account === account.bankName
            );

            return (
              <Tabs.TabPane tab={account.bankName} key={account.bankName}>
                <Table
                  columns={columns}
                  dataSource={filteredTransactions}
                  rowKey="date"
                />
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </div>
      <div>
        <h2>My Banks</h2>
         {/* Display the cards for bank accounts */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
  {cards.map((card, index) => (
    <div
      key={index}
      style={{
        backgroundColor: '#4A90E2', 
        backgroundImage: 'linear-gradient(135deg, #4A90E2, #9013FE)', 
        color: '#fff', 
        borderRadius: '15px', 
        padding: '20px',
        width: '350px', 
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
        fontFamily: 'Arial, sans-serif', 
        letterSpacing: '1px', 
      }}
    >
      {/* Bank Name */}
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
        {card.bankName}
      </div>

      {/* Card Number */}
      <div style={{ fontSize: '20px', letterSpacing: '2px', marginTop: '20px' }}>
        {card.cardNumber}
      </div>

      {/* Expiry Date and Cardholder Name */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <div>
          <div style={{ fontSize: '12px', opacity: '0.7' }}>Expiry</div>
          <div>{card.expiryDate}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', opacity: '0.7' }}>Cardholder</div>
          <div>{card.name}</div>
        </div>
      </div>
    </div>
  ))}
</div>


        
     </div>
    </div>
  );
};

export default Homepage;
