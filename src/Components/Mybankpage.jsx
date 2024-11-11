// src/components/MyBankPage.js
import React, { useContext } from "react";
import { BankContext } from "../Contextapi/BankContext";
import { Card } from "antd";

const MyBankPage = () => {
  const { cards } = useContext(BankContext); // Access card data from context

  // Define an array of colors
  const colors = ['blue', 'green', 'maroon'];

  // Function to get the background color based on the index of the card
  const getCardBackgroundColor = (index) => {
    return colors[index % colors.length]; // Cycle through colors using modulo
  };

  return (
    <div>
      <h2>My Bank Page</h2>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: '20px',
        marginTop: '20px'
      }}>
        {cards.length === 0 ? (
          <p>No cards added yet</p>
        ) : (
          cards.map((card, index) => (
            <div
              key={index}
              style={{
                width: "300px",
                height: "180px",
                backgroundColor: getCardBackgroundColor(index), // Get color based on index
                borderRadius: "10px",
                padding: "20px",
                color: "white", // Text color for better visibility
                marginBottom: "10px",
                position: "relative",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                overflow: "hidden"
              }}
            >
              <h3 style={{ margin: 0 }}>{card.bankName}</h3>
              <p style={{ margin: "10px 0" }}>Name: {card.name}</p>
              <p style={{ margin: "10px 0", fontWeight: "bold" }}>**** **** **** {card.cardNumber.slice(-4)}</p>
              <p style={{ margin: "10px 0" }}>Expiry Date: {card.expiryDate}</p>
              <div style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                fontSize: "12px",
                opacity: 0.5
              }}>
                Debit Card
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBankPage;
