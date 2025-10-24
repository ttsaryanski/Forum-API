export interface UserResponseType {
    id: string;
    email: string;
    username?: string;
    role: string;
    avatarUrl?: string;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface LoginUserResponseType {
    id: string;
    email: string;
    password: string;
    username?: string;
    role: string;
    avatarUrl?: string;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}
