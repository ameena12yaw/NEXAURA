export interface User {
  id: number;
  email: string;
  role: 'student' | 'admin';
  name: string;
}

export interface Material {
  id: number;
  title: string;
  description: string;
  price: number;
  type: string;
  course_code: string;
  department: string;
  instructor: string;
  file_path?: string;
  created_at: string;
}

export interface Purchase {
  id: number;
  user_id: number;
  material_id: number;
  purchase_date: string;
}

export interface AdminStats {
  revenue: number;
  salesCount: number;
  topMaterials: { title: string; sales: number }[];
}
