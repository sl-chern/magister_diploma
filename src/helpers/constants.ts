export const cookiesNames = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
} as const;

export const sex = {
  male: "male",
  female: "female",
} as const;
export type Sex = (typeof sex)[keyof typeof sex];

export const permissionType = {
  readPosts: "read:posts",
  writePosts: "write:posts",
  deletePosts: "delete:posts",
};
export type PermissionType =
  (typeof permissionType)[keyof typeof permissionType];
