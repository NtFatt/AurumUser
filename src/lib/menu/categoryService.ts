import API from "@/lib/apiClient";

export const CategoryService = {
  async getAll() {
    const res = await API.get("/admin/categories");
    return res.data?.data || [];
  },
};
