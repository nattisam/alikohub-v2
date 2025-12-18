import axios from "axios";

export const apiCall = axios.create({
  // baseURL:"https://academy.alikohub.com";
  baseURL: "http://localhost:4200",
});

export const url = "https://academy.alikohub.com";
