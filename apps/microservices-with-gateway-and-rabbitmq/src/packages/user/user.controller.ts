import { UserService } from "src/packages/user/user.service";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern("getUser")
  async getUserById(@Payload() id: string) {
    return this.userService.findById(id);
  }

  @MessagePattern("getUsers")
  async getUsers(@Payload() name: string) {
    return this.userService.getUsers(name);
  }

  @MessagePattern("getProfile")
  async getUserProfile(@Payload() id: string) {
    return this.userService.getUserProfile(id);
  }
}
