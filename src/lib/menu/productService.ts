import API from "@/lib/apiClient";

export const ProductService = {
  async getAll() {
    const res = await API.get("/products");
    return res.data?.data || [];
  },

  async getById(id: number | string) {
    const res = await API.get(`/products/${id}`);
    return res.data?.data || null;
  },
};
