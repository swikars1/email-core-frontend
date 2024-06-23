import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 30000,
});

export const createUser = async (params: { accessToken: string }) => {
  try {
    const { data } = await API.post(
      "/create-user",
      {},
      {
        headers: {
          token: params.accessToken,
        },
      }
    );
    return data;
  } catch (err) {
    throw err;
  }
};

export const getMails = async (params: { accessToken: string }) => {
  try {
    const { data } = await API.get("/mails", {
      headers: {
        token: params.accessToken,
      },
    });
    return data;
  } catch (err) {
    throw err;
  }
};
