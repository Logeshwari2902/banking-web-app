import { Image, Layout, Menu, Button } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { Link, Route, Routes } from "react-router-dom";
import { HomeOutlined, DollarOutlined, AuditOutlined, ScheduleOutlined, BankOutlined } from "@ant-design/icons";
import Logo from "../BankLogo/Bank Logo.png";
import Homepage from "../Components/Homepage";
import MyBankPage from "../Components/Mybankpage";
import SignIn from "./signinpage";
import { useContext, useEffect, useState } from "react";
import { BankContext } from "../Contextapi/BankContext";
import TransactionHistory from "../Components/Transaction";
import PaymentTransfer from "../Components/PaymentTransfer";
import { useDispatch } from 'react-redux'; 
import { resetState } from '../Redux/BankSlice'; 

function MainLayout() {
    const { name, setName, setBankAccounts, setCards } = useContext(BankContext);
    const dispatch = useDispatch();
    const sessionStorageState = sessionStorage.getItem('isLoggedIn')==='true'?true:false;
    const [isLoggedIn, setIsLoggedIn] = useState(sessionStorageState); 

   
    const handleLogout = () => {
        const confirmLogout = window.confirm("If you logout, all the data will be deleted. Are you sure?");
        if (confirmLogout) {
            sessionStorage.setItem('isLoggedIn',false)
            setIsLoggedIn(false);
            // setName(""); 
            // setBankAccounts([]); 
            // setCards([]);
            // dispatch(resetState()); 
            // setIsLoggedIn(false); 
            // window.location.reload();
        }
    };

   
    const handleLogin = (clientName) => {
        // console.log(clientName);
        sessionStorage.setItem('isLoggedIn',true)
        setName(clientName); 
        setIsLoggedIn(true); 
    };

    
    if (!isLoggedIn) {
        return <SignIn setClientName={handleLogin} />; 
    }

    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Image src={Logo} preview={false} style={{ width: "100px", height: "35px" }} />
                
               
                <Button 
                    type="primary" 
                    danger 
                    onClick={handleLogout}
                    style={{ float: 'right' }}
                >
                    Logout
                </Button>
            </Header>
            <Layout>
                <Sider style={{ backgroundColor: "white" }}>
                    <Menu mode="inline">
                        <Menu.Item key="1">
                            <HomeOutlined />
                            <Link to="/">Home</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <DollarOutlined />
                            <Link to="/My Banks">My Banks</Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <AuditOutlined />
                            <Link to="/Transaction History">Transaction History</Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <ScheduleOutlined />
                            <Link to="/Payment Transfer">Payment Transfer</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Content style={{ backgroundColor: "white", padding: '24px' }}>
                    <Routes>
                        <Route path="/" element={<Homepage name={name} />} />
                        <Route path="/My Banks" element={<MyBankPage />} />
                        <Route path="/Transaction History" element={<TransactionHistory />} />
                        <Route path="/Payment Transfer" element={<PaymentTransfer />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}

export default MainLayout;
