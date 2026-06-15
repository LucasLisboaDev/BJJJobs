export type UserRole = "COACH" | "GYM";

export type BeltRank = "WHITE" | "BLUE" | "PURPLE" | "BROWN" | "BLACK";

export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "REVENUE_SHARE";

export interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  beltRank: BeltRank;
  affiliation?: string;
  yearsTeaching: number;
  specialties: string[];
  targetCity?: string;
  bio?: string;
  minPay?: number;
  maxPay?: number;
}

export interface Gym {
  id: string;
  name: string;
  logoUrl?: string;
  affiliation?: string;
  city: string;
  state: string;
  website?: string;
  description?: string;
}

export interface Job {
  id: string;
  gymId: string;
  gym?: Gym;
  title: string;
  jobType: JobType;
  city: string;
  state: string;
  minBelt: BeltRank;
  minYearsTeaching: number;
  styles: string[];
  perks: string[];
  description: string;
  minPay?: number;
  maxPay?: number;
  payType: string;
  featured: boolean;
  active: boolean;
  createdAt: Date;
}
