import { IsEmail, IsNumber, IsOptional, IsString, Length, Matches } from 'class-validator';
import { UserGender } from '../../user/entity/user.entity';

export class InputRegister {
  @IsString()
  username: string;

  @IsString()
  @Length(8, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  passwordCheck: string;

  @IsOptional()
  @IsString()
  fullname: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsNumber()
  gender: UserGender;
}
