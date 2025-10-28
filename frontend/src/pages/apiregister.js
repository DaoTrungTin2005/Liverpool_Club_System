import axios from "axios";

async function createAccount(fullname, email, password) {
  const apiUrl =
    "https://367a5f36e756.ngrok-free.app/api/accounts/create_account";

  try {
    const response = await axios.post(apiUrl, {
      fullname: fullname,
      email: email,
      password: password,
    });

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi:", error.response?.data || error.message);
  }
}

// Gọi ví dụ
createAccount("Test User", "test@example.com", "123456");
