import React, { createContext, useState, useEffect } from 'react';

export const BankContext = createContext();

export const BankProvider = ({ children }) => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [name, setName] = useState('');
  const [cards, setCards] = useState([]);

  // Fetch all cards from the backend
  const fetchAllCards = async () => {
    try {
      const url = process.env.REACT_APP_API_URL;
      const response = await fetch(url+`carddata/carddetail`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const transformedData = data.map(card => ({
        ...card,
        name: card.yourName,
      }));

      setCards(transformedData);
    } catch (error) {
      console.error('Error fetching all cards:', error);
    }
  };

  const fetchName = async () => {
    try {
      const url = process.env.REACT_APP_API_URL;
      const response = await fetch(url+`name/user-name`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setName(data.username); 
    } catch (error) {
      console.error('Error fetching name:', error);
    }
  };

  
  useEffect(() => {
    fetchAllCards();
    fetchName();
  }, []);

  // Function to add a new bank account to the bankAccounts array
  const addBankAccount = (newAccount) => {
    setBankAccounts((prevAccounts) => [...prevAccounts, newAccount]);
  };

  // Function to add a new card to the cards array
  const addCard = (newCard) => {
    setCards((prevCards) => [...prevCards, newCard]);
  };

  return (
    <BankContext.Provider
      value={{
        bankAccounts,
        name,
        cards,
        addCard,
        addBankAccount,
        setBankAccounts,
        setName,
        setCards,
        fetchName,
      }}
    >
      {children}
    </BankContext.Provider>
  );
};
