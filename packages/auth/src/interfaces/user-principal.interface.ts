import { PermissionType } from "@repo/utilities/src/constants/constants";

export interface UserPrincipal {
  id?: string;
  email?: string;
  name?: string;
  permissions?: PermissionType[];
}
