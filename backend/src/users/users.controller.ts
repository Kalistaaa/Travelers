import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('getData')
  async getData(@Body('email') email: string) {
    return await this.usersService.findEmail(email);
  }

  @Post('updateName')
  async updateName(@Body('email') email: string, @Body('name') name: string) {
    return await this.usersService.updateName(email, name);
  }

  @Post('updateGender')
  async updateGender(@Body('email') email: string, @Body('gender') gender: string) {
    return await this.usersService.updateGender(email, gender);
  }

  @Post('updatePhone')
  async updatePhone(@Body('email') email: string, @Body('phone') phone: string) {
    return await this.usersService.updatePhone(email, phone);
  }

  @Post('updateBirthday')
  async updateBirthday(@Body('email') email: string, @Body('birthday') birthday: Date) {
    return await this.usersService.updateBirthday(email, birthday);
  }

  @Post('updateCountry')
  async updateCountry(@Body('email') email: string, @Body('country') country: string) {
    return await this.usersService.updateCountry(email, country);
  }

  @Post('updateAvatar')
  async updateAvatar(@Body('email') email: string, @Body('avatar') avatar: string){
    return await this.usersService.updateAvatar(email,avatar);
  }

  @Post('updatePassword')
  async updatePassword(@Body('email') email: string, @Body('password') password: string){
    return await this.usersService.updatePassword(email,password);
  }

  @Post('updateStep')
  async updateStep(@Body('email') email: string, @Body('userstwoverify') userstwoverify: boolean){
    return await this.usersService.updateStep(email,userstwoverify);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
