export interface UserWithAcademy {
  id: number;
  firebaseId: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  globalRole: string;
  profilePicture: string;
  bio: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  academyUser?: {
    id: string;
    userId: string; 
    role: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
  consultancyUser?: any;
  contechUser?: any;
  eventsUser?: any;
}
