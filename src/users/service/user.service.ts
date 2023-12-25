import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { user, Prisma } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getAllUser(): Promise<user[]> {
    return this.prisma.user.findMany();
  }
  async getUser(username: string): Promise<user | null> {
    return this.prisma.user.findUnique({ where: { username: String(username) } });
  }
  // async createUser(data: user): Promise<user> {
  async createUser(username: string, password: string): Promise<user> {
    let userInput: Prisma.userCreateInput
    userInput = {
      username: username,
      password: password,
    }
    return this.prisma.user.create({
      data: userInput
    });
  }
  async updateUser(id: number, data:user): Promise<user> {
    return this.prisma.user.update({
      where: { id: Number(id) },
      data
    });
  }
  async deleteUser(id: number): Promise<user> {
    return this.prisma.user.delete({
      where: { id: Number(id) },
    });
  }
}