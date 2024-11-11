export async function addAccountInDb(values) {
    try {
        const url = process.env.REACT_APP_API_URL;
        const response = await fetch(url+"addaccount/accounts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values)
        });
        
        if (!response.ok) {
            throw new Error("Failed to add account");
        }
        alert("Account added successfully");
    } catch (error) {
        console.error("Error adding account:", error);
        alert("There was an error adding the account. Please try again.");
    }
}
