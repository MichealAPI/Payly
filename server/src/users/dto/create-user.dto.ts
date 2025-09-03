import {IsString, IsNotEmpty, IsOptional} from 'class-validator';

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsOptional()
    password?: string; // optional for social accounts

    @IsString()
    @IsNotEmpty()
    email: string;

}