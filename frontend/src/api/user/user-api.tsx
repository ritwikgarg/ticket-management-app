// api/user-api.ts
import type { User } from "@/models/User";
import { Role } from "@/enums/user/Role";

export const getUserList = (role?: Role): Promise<{ data: User[] }> => {
    return new Promise((resolve) => {
        const data: User[] = [
            {
                employee_id: "E123",
                first_name: "Nandan",
                last_name: "Vadi",
                email: "nandan@company.com",
                role: Role.SOLVER,
                contact_no: "9999999999",
            },
            {
                employee_id: "57264",
                first_name: "Ritwik",
                last_name: "Garg",
                email: "ritz@company.com",
                role: Role.SOLVER,
                contact_no: "8888888888",
            },
            {
                employee_id: "E432",
                first_name: "Tom",
                last_name: "Blake",
                email: "tom@company.com",
                role: Role.SOLVER,
                contact_no: "1111111111",
            },
            {
                employee_id: "E653",
                first_name: "Jerry",
                last_name: "Washington",
                email: "jerry@company.com",
                role: Role.SOLVER,
                contact_no: "2222222222",
            },
        ];
        setTimeout(() => resolve({ data }), 500); 
    });
};
