import { PermissionType } from "@repo/utilities";

export interface UserPrincipal {
  id?: string;
  email?: string;
  name?: string;
  permissions?: PermissionType[];
}
