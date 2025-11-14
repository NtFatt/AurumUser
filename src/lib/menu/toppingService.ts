import API from "@/lib/apiClient";

export const ToppingService = {
  async getAll() {
    const res = await API.get("/toppings"); // → gọi http://localhost:3001/api/toppings
    return res.data?.data || [];
  },
};
