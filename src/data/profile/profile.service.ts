import { ProfileDetailDTO, UserDTO } from "../../types/data.type";
import { RecommendUserRES } from "../../types/users.type";
import { GetProfileDetailRES, GetProfileSearchRES } from "./profile.response";

export type ProfileSearchDTO = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  email?: string;
  phoneNumber?: string;
  lastName?: string;
  firstName?: string;
  role?: string;
};

export const getProfileSearchDTO = (
  data: GetProfileSearchRES
): ProfileSearchDTO => ({
  id: data.id,
  username: data.displayName || "",
  displayName: data.displayName || "",
  avatarUrl: data.avatarUrl || "",
  bio: data.bio || "",
  email: data.email || "",
  phoneNumber: data.phoneNumber || "",
  lastName: data.lastName || "",
  firstName: data.firstName || "",
  role: data.role || "",
});

export const getProfileDetailDTO = (
  data: GetProfileDetailRES
): ProfileDetailDTO => ({
  id: data.id,
  username: data.displayName,
  userDisplayName: data.displayName,
  profileImage: {
    key: data.avatarUrl,
    url: data.avatarUrl,
  },
  bio: data.bio,
  postCount: 0,
  followerCount: 0,
  followingCount: 0,
  isFollowed: data.isFollowed,
  email: data.email || "",
  phoneNumber: data.phoneNumber || "",
  lastName: data.lastName || "",
  firstName: data.firstName || "",
  role: data.role || "",
});

export const getRecommendUserDTO = (data: RecommendUserRES): UserDTO => ({
  id: data.userId,
  username: data.user.displayName,
  userDisplayName: data.user.displayName,
  profileImage: {
    key: data.user.avatarUrl,
    url: data.user.avatarUrl,
  },
  email: data.user.email || "",
  phoneNumber: data.user.phoneNumber || "",
  lastName: data.user.lastName || "",
  firstName: data.user.firstName || "",
  role: data.user.role || "",
});
