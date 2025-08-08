import { IsString } from "class-validator";

export class SettingsUpdateDto {
    
    @IsString()
    firstName?: string;

    @IsString()
    lastName?: string;

    @IsString()
    email?: string;

    @IsString()
    password?: string;

   @IsString()
   settings?: string;

}