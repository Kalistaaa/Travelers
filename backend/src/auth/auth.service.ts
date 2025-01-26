import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { AdminsService } from 'src/admins/admins.service';
import { UsersService } from 'src/users/users.service';
import { hash, compare } from 'bcrypt';
import { EntityManager } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Admin } from 'src/admins/entities/admin.entity';


@Injectable()
export class AuthService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  constructor(
    private usersService: UsersService,
    private adminService: AdminsService,
    private jwtService: JwtService
  ) { }

  async validateGoogleUser(profile: any): Promise<any> {
    const user = await this.usersService.findOrCreateGoogleUser(profile);
    return user;
  }

  async validateFacebookUser(profile: any): Promise<any> {
    const user = await this.usersService.findOrCreateFacebookUser(profile);
    return user;
  }

  async generateJwt(user: any) {
    const payload = { email: user.email, sub: user.name };
    return this.jwtService.sign(payload, {
      expiresIn: "7d",
    });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    const hashedPassword = await hash(password, saltRounds);
    return hashedPassword;
  }

  async findLogin(email: string, password: string) {
    const user = await this.usersService.findEmail(email);
    const admin = await this.adminService.findEmail(email);
    if (user) {
      const isMatch = await compare(password, user.userspass);
      if (isMatch) {
        const payload = { email: user.usersemail, name: user.usersname, role: 'user' };
        const token = this.jwtService.sign(payload);
        return { token, user };
      } else {
        throw new Error('Invalid user credentials');
      }
    } else if (admin) {
      const isMatch = await compare(password, admin.adminspass);
      if (isMatch) {
        const payload = { email: admin.adminsemail, name: admin.adminsname, role: 'admin' };
        const token = this.jwtService.sign(payload);
        return { token, admin };
      } else {
        throw new Error('Invalid admin credentials');
      }
    } else {
      throw new Error('The account is not in the system');
    }
  }


  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
