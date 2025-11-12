import API from "@/lib/apiClient";

export const CategoryService = {
  async getAll() {
    const res = await API.get("/admin/category"); // hoặc /api/admin/category tùy BE
    return res.data?.data || [];
  },
};
