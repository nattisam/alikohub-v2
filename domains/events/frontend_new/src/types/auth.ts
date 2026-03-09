export interface AcademyUser {
    id: string;
    userId: string;
    role: string;
    activeRole: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface CareersUser {
    id: string;
    userId: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: number;
    firebaseId: string;
    firstname: string;
    lastname: string;
    email: string;
    globalRole: string;
    profilePicture: string | null;
    bio: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    academyUser: AcademyUser | null;
    consultancyUser: any | null;
    contechUser: any | null;
    eventsUser: any | null;
    careersUser: CareersUser | null;
    academyRole: string;
    academyActiveRole: string;
    academyStatus: string;
    careersRole: string;
    careersStatus: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
    firebaseCustomToken: string;
}

export interface LoginCredentials {
    email: string;
    password?: string; // Standard login usually has password
}

export interface RegisterCredentials {
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
}
