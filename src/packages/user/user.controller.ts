import { UserService } from "@/packages/user/user.service";
import { Controller, Get, Param, Query } from "@nestjs/common";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  async getUserById(@Param("id") id: string) {
    return this.userService.findById(id);
  }

  @Get()
  async getUsers(@Query("name") name: string) {
    return this.userService.getUsers(name);
  }
}
