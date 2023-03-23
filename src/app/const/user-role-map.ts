import {UserRole} from "../enum/user-role.enum";

export const UserRoleMap =
  {
    [UserRole.ROLE_ADMIN.valueOf()]: "ADMIN",
    [UserRole.ROLE_USER.valueOf()]: "USER",
    [UserRole.ROLE_PROJECT_LEADER.valueOf()]: "PROJECT_LEADER"
  }
