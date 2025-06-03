import { UserService } from "src/packages/user/user.service";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern("getUser")
  async getUserById(@Payload() body: { id: string }) {
    return this.userService.findById(body.id);
  }

  @MessagePattern("getUsers")
  async getUsers(@Payload() payload: { name?: string; ids?: string[] }) {
    return this.userService.getUsers(payload.name, payload.ids);
  }

  @MessagePattern("getProfile")
  async getUserProfile(@Payload() body: { id: string }) {
    return this.userService.getUserProfile(body.id);
  }
}
