import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Typography, Row, Col, Select, Button, DatePicker } from 'antd';
import { BankOutlined } from '@ant-design/icons';
import { fetchBankAccounts, selectBankAccounts, addTransaction, transferFunds } from '../Redux/BankSlice';

const { Title, Text } = Typography;
const { Option } = Select;

const PaymentTransfer = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Fetch bank accounts from the Redux store on component mount
  useEffect(() => {
    dispatch(fetchBankAccounts()); // Fetch data from backend
  }, [dispatch]);

  // Select bank accounts from the Redux store
  const bankAccounts = useSelector(selectBankAccounts);

  const handleSubmit = async (values) => {
    const { account, amount, status } = values; // Get the status from form values
    const selectedAccount = bankAccounts.find(acc => acc.bankName === account);

    try {
      const url = process.env.REACT_APP_API_URL;
      const response = await fetch(url+'transactions/addtransactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Error doing transaction');
      }
    } catch (error) {
      console.error('Error doing transaction:', error);
      alert('Transaction failed. Please check your credentials');
    }

    alert(`
      Account: ${values.account || 'N/A'}
      Note: ${values.note || 'N/A'}
      Recipient's Email: ${values.email || 'N/A'}
      Bank Account Number: ${values.bankAccount || 'N/A'}
      Amount: ${values.amount || 'N/A'}
      Date: ${values.date ? values.date.format('YYYY-MM-DD') : 'N/A'}
      Category: ${values.category || 'N/A'}
      Transaction: ${values.transaction || 'N/A'}
      Status: ${status || 'N/A'}
    `);

    // Only proceed with the transfer if the status is "Success"
    if (status === 'Success' && selectedAccount) {
      dispatch(transferFunds({ accountName: selectedAccount.bankName, amount: parseFloat(amount) }));
      // Show success alert
      alert(`Transfer successful: ${amount} transferred from ${account}`);
    } else if (status !== 'Success') {
      alert('Transfer not processed: Transaction status is not "Success".');
    }

    // Dispatch action to add transaction to the Redux store regardless of status
    const transaction = {
      account: values.account,
      note: values.note,
      email: values.email,
      bankAccount: values.bankAccount,
      amount: values.amount,
      date: values.date.format('YYYY-MM-DD'),
      category: values.category,
      transaction: values.transaction,
      status: values.status, // Add status to transaction object
    };

    dispatch(addTransaction(transaction));
    form.resetFields(); // Reset form fields
  };

  return (
    <div style={{ padding: '10px' }}>
      <Title level={2}>Payment Transfer</Title>
      <Text>Please provide any specific details or notes related to the payment transfer.</Text>

      <Title level={4} style={{ marginTop: '20px' }}>Transfer Details</Title>
      <Text>Enter the details of the recipient</Text>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item>
              <Title level={4}>Select Source Bank</Title>
              <Text>Select the bank account you want to transfer funds from</Text>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="account"
              label="Select Account"
              rules={[{ required: true, message: 'Please select an account!' }]}
            >
              <Select placeholder="Select an account" suffixIcon={<BankOutlined />}>
                {bankAccounts.map((account) => (
                  <Option key={account.id} value={account.bankName}>
                    {account.bankName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="note"
              label="Transfer Note (Optional)"
            >
              <Input.TextArea placeholder="Add your note here" autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Title level={4}>Bank Account Details</Title>
            <Text>Enter the bank account details of the recipient.</Text>

            <Form.Item
              name="email"
              label="Recipient's Email Address"
              rules={[{ required: true, message: "Please enter the recipient's email!" }]}
            >
              <Input placeholder="Enter recipient's email" />
            </Form.Item>

            <Form.Item
              name="bankAccount"
              label="Recipient's Bank Account Number"
              rules={[{ required: true, message: 'Please enter the bank account number!' }]}
            >
              <Input placeholder="Enter bank account number" />
            </Form.Item>

            <Form.Item
              name="amount"
              label="Amount"
              rules={[{ required: true, message: 'Please enter an amount!' }]}
            >
              <Input placeholder="Enter amount" type="number" />
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Please select a date!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select a category!' }]}
            >
              <Input placeholder="Enter the payment category" />
            </Form.Item>

            <Form.Item
              name="transaction"
              label="Transaction"
              rules={[{ required: true, message: 'Please enter the Recipient Name!' }]}
            >
              <Input placeholder="Enter Recipient's Name" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Transaction Status"
              rules={[{ required: true, message: 'Please select a transaction status!' }]}
            >
              <Select placeholder="Select transaction status">
                <Option value="Success">Success</Option>
                <Option value="Pending">Pending</Option>
                <Option value="Processing">Processing</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Transfer Funds
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default PaymentTransfer;
