import { PermissionType } from "@/helpers/constants";

export interface UserPrincipal {
  id?: string;
  email?: string;
  name?: string;
  permissions?: PermissionType[];
}
