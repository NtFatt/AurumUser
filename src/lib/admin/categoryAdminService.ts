// src/lib/admin/categoryAdminService.ts
import API from "@/lib/apiClient";

export const CategoryAdminService = {
  async getAll() {
    const res = await API.get("/admin/category");
    return res.data?.data || [];
  },
  async create(name: string) {
    return API.post("/admin/category", { Name: name });
  },
  async update(id: string | number, name: string) {
    return API.put(`/admin/category/${id}`, { Name: name });
  },
  async delete(id: string | number) {
    return API.delete(`/admin/category/${id}`);
  },
};
