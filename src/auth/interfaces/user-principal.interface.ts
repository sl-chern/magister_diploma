import { PermissionType } from "src/helpers/constants";

export interface UserPrincipal {
  id?: string;
  email?: string;
  name?: string;
  permissions?: PermissionType[];
}
