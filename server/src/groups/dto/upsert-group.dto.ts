import { IsString, IsNotEmpty } from 'class-validator';

export class UpsertGroupDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    icon: string;

}

