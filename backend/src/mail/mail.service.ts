import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/users/entities/user.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class MailService {
    @InjectEntityManager()
    private entityManager: EntityManager;
    constructor(private mailerService: MailerService) { }

    async sendUserConfirmation(email: string, vetifyCode: string, namemail: string) {
        let user = await this.entityManager.findOne(User, { where: { usersemail: email } });

        if(user){
            await this.mailerService.sendMail({
                to: email,
    
                subject: 'Confirm Code your Email',
                template: 'verify',
                context: {
                    name: user.usersname,
                    namemail: namemail,
                    vetifyCode: vetifyCode
                },
            });
        }else{
            return { success: false, message: 'User don\'t already exists' };
        }
    }
}
