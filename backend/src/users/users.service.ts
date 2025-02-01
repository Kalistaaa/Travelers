import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';
import axios from 'axios';
import { compare, hash } from 'bcryptjs';
import { Admin } from 'src/admins/entities/admin.entity';

@Injectable()
export class UsersService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  async findEmail(email: string) {
    return await this.entityManager
      .createQueryBuilder(User, 'users')
      .where('users.usersemail = :email', { email })
      .getOne()
  }

  async findUsers(email: string, password: string) {
    return await this.entityManager
      .createQueryBuilder(User, 'users')
      .where('users.usersemail = :email', { email })
      .andWhere('users.userspass = :password', { password })
      .getOne()
  }

  async verifyGoogleToken(tokenId: string) {
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${tokenId}`,
    );
    return response.data;
  }

  async verifyFacebookToken(accessToken: string) {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
      );
      return response.data;
    } catch (error) {
      throw new UnauthorizedException('Invalid Facebook access token');
    }
  }

  async findOrCreateGoogleUser(profile: any) {
    const { email, name, picture } = profile;

    let user = await this.entityManager.findOne(User, { where: { usersemail: email } });
    console.log(user);

    if (!user) {
      user = this.entityManager.create(User, {
        usersemail: email,
        usersname: name,
        userspass: '',
        usersbirthday: '1990-01-01',
        userspath: picture,
        usersgender: '',
        userscreated: new Date(),
        usersaddress: '',
        userschange: false,
        usersphone: '',
        usersnation: '',
        userstwoverify: false,
        usersisactive: true
      });


      await this.entityManager.save(user);
    } else {
      return user;
    }

    return user;
  }

  async findOrCreateFacebookUser(profile: any) {
    const { email, picture, name } = profile;
    let user = await this.entityManager.findOne(User, { where: { usersemail: email } });
    if (!user) {
      user = this.entityManager.create(User, {
        usersemail: email,
        usersname: name,
        userspass: '',
        usersbirthday: '1990-01-01',
        userspath: picture.data.url,
        usersgender: '',
        userscreated: new Date(),
        usersaddress: '',
        userschange: false,
        usersphone: '',
        usersnation: '',
        userstwoverify: false,
        usersisactive: true
      });

      await this.entityManager.save(user);
    } else {
      return user;
    }

    return user;
  }

  async activeUser(email: string) {
    const user = await this.entityManager.findOne(User, { where: { usersemail: email } });
    if (user) {
      user.usersisactive = true;
      await this.entityManager.save(user);
      return user;
    } else {
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    const hashedPassword = await hash(password, saltRounds);
    return hashedPassword;
  }

  async registerUser(email: string, password: string, confirm: string): Promise<any> {
    const user = await this.entityManager.findOne(User, { where: { usersemail: email } });
    const admin = await this.entityManager.findOne(Admin, { where: { adminsemail: email } });
    if (user || admin) {
      return { message: "Account already exist" };
    } else {
      if (password === confirm) {
        const hashPass = await this.hashPassword(password);
        const newUser = this.entityManager.create(User, {
          usersemail: email,
          usersname: 'User',
          userspass: hashPass,
          usersbirthday: '1990-01-01',
          userspath: 'https://drive.google.com/file/d/15HsyUctpxGLBuDDwOrIBPWtIpj9tWOCN/view?usp=sharing',
          usersgender: '',
          userscreated: new Date(),
          usersaddress: '',
          userschange: true,
          usersphone: '',
          usersnation: '',
          userstwoverify: false,
          usersisactive: false
        });

        await this.entityManager.save(newUser);
        return { success: true, user: newUser };
      } else {
        return { success: false, message: 'Account already exists' }
      }
    }
  }

  async updateName(email: string, name: string) {
    const users = await this.entityManager.findOne(User, { where: { usersemail: email } });
    if (users) {
      await this.entityManager.update(User, users.usersemail, {
        usersname: name
      });
      return { success: true, message: 'Full Name updated successfully' };
    } else {
      return { fail: true, message: 'User not found' };
    }
  }

  async updateGender(email: string, gender: string) {
    const users = await this.entityManager.findOne(User, { where: { usersemail: email } });
    if (users) {
      await this.entityManager.update(User, users.usersemail, {
        usersgender: gender
      });
      return { success: true, message: 'Gender updated successfully' };
    } else {
      return { fail: true, message: 'User not found' };
    }
  }

  async updatePhone(email: string, phone: string) {
    const users = await this.entityManager.findOne(User, { where: { usersemail: email } });
    if (users) {
      await this.entityManager.update(User, users.usersemail, {
        usersphone: phone
      });
      return { success: true, message: 'Phone updated successfully' }
    } else {
      return { fail: true, message: 'User not found' };
    }
  }

  async updateBirthday(email: string, birthday: Date) {
    const users = await this.entityManager.findOne(User, { where: { usersemail: email } });
    if (users) {
      await this.entityManager.update(User, users.usersemail, {
        usersbirthday: birthday
      });
      return { success: true, message: 'Birthday updated successfully' }
    } else {
      return { fail: true, message: 'User not found' };
    }
  }

  async updateCountry(email: string, country: string) {
    const users = await this.entityManager.findOne(User, { where: { usersemail: email } });
    if (users) {
      await this.entityManager.update(User, users.usersemail, {
        usersnation: country
      });
      return { success: true, message: 'Country updated successfully' }
    } else {
      return { fail: true, message: 'User not found' };
    }
  }

  async updateAvatar(email: string, avatar: string) {
    const users = await this.entityManager.findOne(User, { where: { usersemail: email } });
    if (users) {
      await this.entityManager.update(User, users.usersemail, {
        userspath: avatar
      });
      return { success: true, message: 'Avatar updated successfully' }
    } else {
      return { fail: true, message: 'User not found' };
    }
  }

  async updatePassword(email: string, password: string): Promise<any> {
    const users = await this.entityManager.findOne(User, { where: { usersemail: email } });
    if (users) {
      if (users.userschange) {
        const hashPass = await this.hashPassword(password);
        await this.entityManager.update(User, users.usersemail, {
          userspass: hashPass,
        });
      } else {
        const hashPass = await this.hashPassword(password);
        await this.entityManager.update(User, users.usersemail, {
          userspass: hashPass,
          userschange: true
        });
      }
      return { success: true, message: 'Password updated successfully' }
    } else {
      return { fail: true, message: 'User not found' };
    }
  }

  async updateStep(email: string, userstwoverify: boolean){
    const users = await this.entityManager.findOne(User, { where: { usersemail: email } });
    if (users) {
      await this.entityManager.update(User, users.usersemail, {
        userstwoverify: userstwoverify
      });
      return { success: true, message: 'Verification updated successfully' }
    } else {
      return { fail: true, message: 'User not found' };
    }
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
