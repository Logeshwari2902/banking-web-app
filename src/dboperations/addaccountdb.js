export async function addAccountInDb(values) {
    try {
        const url = process.env.REACT_APP_API_URL;
        const response = await fetch(url+"addaccount/accounts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxvZ2VzaHdhcmkiLCJyb2xlIjoidXNlciIsImlhdCI6MTcyOTY2Mjc4MywiZXhwIjoxNzI5NjY2MzgzfQ.xr2EIA2y8CvWp0n-gnphvSf39EMoWZ7kCnNx6m-AQUM"
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
