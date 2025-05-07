import { SetMetadata } from "@nestjs/common";
import { HAS_PERMISSIONS_KEY } from "../helpers/auth.constants";
import { PermissionType } from "@repo/utilities";

export const HasPermissions = (...args: PermissionType[]) =>
  SetMetadata(HAS_PERMISSIONS_KEY, args);
