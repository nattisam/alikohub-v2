export class SelectRoleDto {
  userId!: string;
  role!: 'student' | 'teacher';
}

export class TeacherApplicationDto {
  userId!: string;
  personalDetails!: {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
  };
  teachingCategories!: string[];
  resumeUrl?: string;
  interviewResponses!: {
    question: string;
    answer: string;
  }[];
  documents?: {
    name: string;
    url: string;
  }[];
}

export class SwitchRoleDto {
  newRole!: 'student' | 'teacher';
}
