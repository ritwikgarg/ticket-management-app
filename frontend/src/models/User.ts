import type { Role } from "@/enums/user/Role";

export interface User {
  employee_id: string;
  first_name: string;
  last_name: string;
  role: Role;
  email: string;
  contact_no: string;
}
