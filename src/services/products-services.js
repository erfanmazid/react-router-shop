import axios from "axios";
import { BASE_URL, PRODUCTS_URL } from "./api";

export const readProducts = async (queryString = "", available = "") => {
  const url = new URL(`${BASE_URL}${PRODUCTS_URL}`);
  console.log(url);
  if (queryString) {
    url.searchParams.set("q", queryString);
  }
  if (available) {
    url.searchParams.set("available", available);
  }
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const readProduct = async (id) => {
  const url = new URL(`${BASE_URL}${PRODUCTS_URL}/${id}`);
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

const productService = {
  readProducts,
  readProduct,
};
export default productService;
