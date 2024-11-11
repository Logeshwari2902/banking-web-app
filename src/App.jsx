import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './Pages/Mainlayout';
import { BankProvider } from './Contextapi/BankContext';
import { Provider } from 'react-redux';
import store from './Redux/Store';

function App() {
  return (
    <Provider store={store}>
      <BankProvider>
        <Router>
          <MainLayout />
        </Router>
      </BankProvider>
    </Provider>
  );
}

export default App;
