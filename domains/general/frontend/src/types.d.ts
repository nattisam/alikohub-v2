export interface JobDetail {
  title: string;
  industryCategory: string;
  employmentCategory: JobEmploymentCategory;
  employmentType: string;
  locationCity: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salaryRange: string;
}

export enum JobEmploymentCategory {
  REMOTE = "REMOTE",
  HYBRID = "HYBRID",
  IN_PERSON = "IN_PERSON",
}

export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
  VOLUNTEER = "VOLUNTEER",
}
