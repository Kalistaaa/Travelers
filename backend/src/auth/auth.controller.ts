import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AdminsService } from 'src/admins/admins.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private adminService: AdminsService,
    private jwtService: JwtService,
    private mailService: MailService
  ) { }

  @Post('google')
  async googleLogin(@Body() body: any) {
    const { tokenId } = body;

    const googleProfile = await this.userService.verifyGoogleToken(tokenId);

    const user = await this.authService.validateGoogleUser(googleProfile);

    const jwt = await this.authService.generateJwt(user);

    return { token: jwt, user };
  }

  @Post('facebook')
    async facebookLogin(@Body() body: any){
      const { accessToken } = body;

      const fackebookProfile = await this.userService.verifyFacebookToken(accessToken);

      const user = await this.authService.validateFacebookUser(fackebookProfile);

      const jwt = await this.authService.generateJwt(user);

      return { token: jwt, user };
    }
  

  @Post('findEmail')
  async findEmail(@Body('email') email: string) {
    const user = await this.userService.findEmail(email);
    const admin = await this.adminService.findEmail(email);
    if (user) {
      return user;
    } else if (admin) {
      return admin;
    } else {
      return "No account found with this email. Please check and try again.";
    }
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    try {
      const result = await this.authService.findLogin(email, password);
      const decodedToken = this.jwtService.decode(result.token) as any;
      return {
        status: 'success',
        token: result.token,
        user: result,
        role: decodedToken.role,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new HttpException({
        status: 'error',
        message: error.message || 'Login failed',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('verify')
  async sendMail(@Body('email') email: string){
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const namemail = "Travel Verification Email.";
    await this.mailService.sendUserConfirmation(email, token, namemail);
    return { message: "Sent code!", token };
  }

  @Post('faCode')
  async sendMailFaCode(@Body('email') email: string){
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const namemail = "Travel 2-Step Code Email.";
    await this.mailService.sendUserConfirmation(email, token, namemail);
    return { message: "Sent code!", token };
  }

  @Post('activeUser')
  async activeUser(@Body('email') email: string){
    await this.userService.activeUser(email);
    return { message: "Active user success!" };
  }

  @Post('registerUser')
  async registerUser(@Body('email') email: string, @Body('password') password: string, @Body('confirm') confirm: string){
    return await this.userService.registerUser(email, password, confirm);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
