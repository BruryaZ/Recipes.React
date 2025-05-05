export interface User {
    Id: number;
    UserName: string;
    Password: string;
    Name: string;
    Phone: string;
    Email: string;
    Tz: string;
    createdAt?: Date;
    updatedAt?: Date;
}