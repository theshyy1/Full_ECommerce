import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getProducts2API,
  deleteProductAPI,
  addProductAPI,
  getProductsAPI,
} from "../services/http";

export const useProductStore = defineStore("products", () => {
  const allProducts = ref([]);
  const isLoading = ref(false);
  const darkTheme = ref(false);

  const toggleTheme = () => {
    darkTheme.value = !darkTheme.value;
  };

  const getFilteredProducts = async (page = 1, limit) => {
    const res = await getProductsAPI(page, limit);
    const data = await res.data;
    allProducts.value = data;
  };

  const deleteProduct = async (id) => {
    try {
      await deleteProductAPI(id);
      allProducts.value = allProducts.value.filter((item) => item._id !== id);
    } catch (error) {
      console.log("ADD_ERROR", error);
    }
  };

  const addProduct = async (product) => {
    try {
      await addProductAPI(product);
    } catch (error) {
      console.log("ADD_ERROR", error);
    }
  };

  const getAllProducts = () => {
    getProducts2API().then(({ data }) => {
      allProducts.value = data.allProducts;
    });
  };

  return {
    allProducts,
    isLoading,
    getFilteredProducts,
    getAllProducts,
    deleteProduct,
    addProduct,
    darkTheme,
    toggleTheme,
  };
});
