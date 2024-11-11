import React, { useEffect, useState } from 'react';
import { Select, Card, Table, Typography, Row, Col } from 'antd';
import { BankOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectBankAccounts,
  selectTransactions,
  selectSelectedBank,
  setSelectedBank,
  fetchBankAccounts, // Import the action
  fetchTransactions,
} from '../Redux/BankSlice';

const { Option } = Select;
const { Title, Paragraph } = Typography;

const TransactionHistory = () => {
  const dispatch = useDispatch();
  const bankAccounts = useSelector(selectBankAccounts) || [];
  const transactions = useSelector(selectTransactions) || [];
  const selectedBank = useSelector(selectSelectedBank);

  // State to hold the remaining balance from the backend
  const [remainingBalance, setRemainingBalance] = useState(0);

  // Fetch bank accounts and transactions when the component mounts
  useEffect(() => {
    dispatch(fetchBankAccounts()); // Fetch bank accounts
    dispatch(fetchTransactions()); // Fetch transactions
  }, [dispatch]);

  // Ensure selected bank is set on initial load
  useEffect(() => {
    if (bankAccounts.length > 0 && !selectedBank) {
      dispatch(setSelectedBank(bankAccounts[0].bankName));
    }
  }, [bankAccounts, selectedBank, dispatch]);

  // Fetch remaining balance from backend when selected bank changes
  useEffect(() => {
    if (selectedBank) {
      fetchRemainingBalance(selectedBank);
    }
  }, [selectedBank]);

  // Fetch remaining balance from backend API
  const fetchRemainingBalance = async (bankName) => {
    try {
      const url = process.env.REACT_APP_API_URL;
      const response = await fetch(url+`updatedbalance/preview-transactions/${bankName}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const bankData = data.results.find(item => item.bankName === bankName);
        if (bankData) {
          setRemainingBalance(bankData.previewRemainingBalance);
        }
      }
    } catch (error) {
      console.error('Error fetching remaining balance:', error);
    }
  };

  const handleBankChange = (value) => {
    dispatch(setSelectedBank(value));
  };

  const selectedBankDetails = bankAccounts.find((bank) => bank.bankName === selectedBank);

  // Filter transactions based on selected bank
  const filteredTransactions = transactions.filter(
    (transaction) => transaction.account === selectedBank
  );

  const colorArray = ['lightgreen', 'lightblue', 'orange', 'pink'];
  const getBankColor = (bankName) => {
    const bankIndex = bankAccounts.findIndex((bank) => bank.bankName === bankName);
    return colorArray[bankIndex % colorArray.length];
  };

  const selectedBankColor = getBankColor(selectedBank);

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
        const { textColor, backgroundColor, borderRadius } = getStatusStyles(record.status);
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

  const cardStyle = {
    backgroundColor: selectedBankColor || 'grey',
    color: 'white',
    padding: '20px',
    borderRadius: '10px',
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]} justify="space-between" align="middle">
        <Col>
          <Title level={1}>Transaction History</Title>
          <Paragraph>Gain insights and track your transactions over time.</Paragraph>
        </Col>

        <Col>
          <Title level={4} style={{ marginBottom: '8px' }}>
            <BankOutlined /> Select Bank
          </Title>
          <Select style={{ width: 200 }} value={selectedBank} onChange={handleBankChange}>
            {bankAccounts.map((bank) => (
              <Option key={bank.bankName} value={bank.bankName}>
                {bank.bankName}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Card style={{ ...cardStyle, marginTop: '24px' }}>
        <Row>
          <Col span={12}>
            <Title level={2}>
              Total Balance: ${remainingBalance || 0}
            </Title>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Paragraph>
              <strong>Bank Name:</strong> {selectedBankDetails?.bankName || 'N/A'}
              <br />
              <strong>Card Number:</strong> {selectedBankDetails?.cardNumber || 'N/A'}
            </Paragraph>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredTransactions}
        style={{ marginTop: '16px' }}
        rowKey="date"
      />
    </div>
  );
};

export default TransactionHistory;
