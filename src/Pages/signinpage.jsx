import React, { useState } from 'react';
import { Tabs, Form, Input, Button, Typography } from 'antd';
import 'antd/dist/reset.css'; // Ant Design's CSS

const { TabPane } = Tabs;
const { Title } = Typography;

const SignIn = ({ setClientName }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (name.trim() === '' || password.trim() === '') {
      alert("Please fill in both fields");
      return;
    }

    try {
      const url = process.env.REACT_APP_API_URL;
      const response = await fetch(url+'userdetail/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name, password : password}),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const token = await response.text();
      sessionStorage.setItem('token',token);
      setClientName(token.username); 
      // setName(token.username);
      // alert(`Welcome ${data.username}, you are logged in!`);
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please check your username and password.');
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit}
      style={{ maxWidth: '300px', margin: '0 auto' }}
    >
      <Form.Item
        label="Name"
        rules={[{ required: true, message: 'Please enter your name' }]}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </Form.Item>
      <Form.Item
        label="Password"
        rules={[{ required: true, message: 'Please enter your password' }]}
      >
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (username.trim() === '' || password.trim() === '') {
      alert("Please fill in both fields");
      return;
    }

    try {
      const url = process.env.REACT_APP_API_URL;
      const response = await fetch(url+'userdetail/userinfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      alert(`Welcome ${data.username}, you have signed up!`);
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Failed to sign up. Please try again.');
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSignUp}
      style={{ maxWidth: '300px', margin: '0 auto' }}
    >
      <Form.Item
        label="Username"
        rules={[{ required: true, message: 'Please enter a username' }]}
      >
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
      </Form.Item>
      <Form.Item
        label="Password"
        rules={[{ required: true, message: 'Please enter your password' }]}
      >
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
};

const SignInPage = ({ setClientName }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ width: '400px', padding: '40px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
          Welcome to Shero Banking
        </Title>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Login" key="1">
            <SignIn setClientName={setClientName}/>
          </TabPane>
          <TabPane tab="Sign Up" key="2">
            <SignUp />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default SignInPage;
