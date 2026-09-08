import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./api";

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export async function signup(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await handleResponse(response);
  await AsyncStorage.setItem("token", data.token);
  await AsyncStorage.setItem("user", JSON.stringify(data.user));
  return data;
}

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(response);
  await AsyncStorage.setItem("token", data.token);
  await AsyncStorage.setItem("user", JSON.stringify(data.user));
  return data;
}

export async function forgotPassword(email) {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
}

export async function logout() {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
}

export async function getToken() {
  return AsyncStorage.getItem("token");
}
