import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/database/user-database/repository/user.repository";
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

  async getUsers(name?: string, ids?: string[]) {
    const query = this.userRepository.createQueryBuilder("users");

    query.where("1=1");

    if (name) {
      query.andWhere("users.name ILIKE :name", { name });
    }

    if (ids) {
      query.andWhere("users.ids IN (:...ids)", { ids });
    }

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

    return await query.getOne();
  }
}
