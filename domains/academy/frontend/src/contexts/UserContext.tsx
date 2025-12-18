import type { INotification, Language, SignupForm, User } from "../components/types.d";
import { createContext, type Dispatch } from "react";

// Add AcademyRole enum
export type AcademyRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

// Extend the User interface
export interface ExtendedUser extends User {
  hasSelectedRole: boolean;
  academyRole: AcademyRole | null;
}

interface UserContextType {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  currentUser: ExtendedUser | null; // Update type
  language: Language; 
  setLanguage:Dispatch<Language>;
  notifications:INotification[];
  loginLoading: boolean;
  loginError: string | null;
  signupError: string | null;
  signupLoading: boolean;
  clearLoginError: () => void;
  clearSignupError: () => void;
  setCurrentUser: Dispatch<ExtendedUser | null>;  // Update type
  register: ({
    firstname,
    lastname,
    email,
    password,
  }: SignupForm) => Promise<boolean>;
  // Add new methods
  selectRole: (role: AcademyRole) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);