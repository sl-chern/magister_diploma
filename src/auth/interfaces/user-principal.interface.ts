import { PermissionType } from "../helpers/permission-type.enum";

export interface UserPrincipal {
  id?: string;
  email?: string;
  name?: string;
  permissions?: PermissionType[];
}
