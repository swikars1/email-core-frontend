import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
});

export const createUser = async (params: {
  emailAddress: string;
  accountId: string;
  accessToken: string;
}) => {
  try {
    await API.post("/create-user", params);
  } catch (err) {
    throw err;
  }
};
