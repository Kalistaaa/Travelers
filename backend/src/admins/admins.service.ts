import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  async findEmail(email: string) {
    return await this.entityManager
      .createQueryBuilder(Admin, 'admins')
      .where('admins.adminsemail = :email', { email })
      .getOne()
  }

  async findAdmins(email: string, password: string){
    return await this.entityManager
    .createQueryBuilder(Admin, 'admins')
    .where('admins.adminsemail = :email', {email})
    .andWhere('admins.adminspass = :password', {password})
    .getOne()
  }

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
