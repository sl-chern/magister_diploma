import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/database/repository/user.repository";
import { ILike } from "typeorm";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: ["permissions"],
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async getUsers(name: string) {
    return this.userRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
    });
  }
}
