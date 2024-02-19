export interface User {
    email: string;
    userType: "admin" | "team";
    token: string;
}