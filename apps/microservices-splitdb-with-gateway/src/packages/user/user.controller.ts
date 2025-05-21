import { UserService } from "src/packages/user/user.service";
import { Controller, Get, Param, Query } from "@nestjs/common";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  async getUserById(@Param("id") id: string) {
    return this.userService.findById(id);
  }

  @Get()
  async getUsers(@Query("name") name?: string, @Query("id") ids?: string[]) {
    return this.userService.getUsers(name, ids);
  }

  @Get("profile/:id")
  async getUserProfile(@Param("id") id: string) {
    return this.userService.getUserProfile(id);
  }
}
