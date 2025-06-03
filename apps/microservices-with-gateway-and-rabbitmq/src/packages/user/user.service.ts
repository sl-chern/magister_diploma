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

  async getUserProfile(id: string) {
    const query = this.userRepository.createQueryBuilder("users");

    query.where("users.id = :id", { id });

    query.innerJoinAndSelect("users.permissions", "permissions");

    query.loadRelationCountAndMap("users.quotes", "users.quotes");
    query.loadRelationCountAndMap(
      "users.sendedMessages",
      "users.sendedMessages",
    );
    query.loadRelationCountAndMap("users.subscribers", "users.subscribers");
    query.loadRelationCountAndMap("users.following", "users.following");
    query.loadRelationCountAndMap("users.notifications", "users.notifications");

    return await query.getOne();
  }
}
