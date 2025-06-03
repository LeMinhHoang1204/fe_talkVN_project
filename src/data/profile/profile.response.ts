export type GetProfileSearchRES = {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  bio: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
};

export type GetProfileDetailRES = {
  id: string;
  displayName: string;
  avatarUrl: string;
  email: string;
  phoneNumber: string;
  bio: string;
  dateOfBirth: string;
  gender: string;
  // isFollowed: boolean;
  firstName?: string;
  lastName?: string;
  role?: string;
};
