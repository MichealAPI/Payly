import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, IsMongoId, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class SplitDetailDto {
    @IsMongoId()
    @IsNotEmpty()
    user: string; // user ID as a string from the client

    @IsNumber()
    @IsNotEmpty()
    splitAmount: number;

    @IsOptional()
    isEnabled?: boolean;
}

export class ExpenseDto {
    @IsOptional()
    @IsMongoId()
    _id?: string; // For upserting

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsEnum(['deposit', 'expense'])
    @IsNotEmpty()
    type: 'deposit' | 'expense';

    @IsEnum(['equal', 'fixed', 'percentage'])
    @IsNotEmpty()
    splitMethod: 'equal' | 'fixed' | 'percentage';

    @IsNotEmpty()
    @IsString()
    currency: string;

    @IsNotEmpty()
    @IsString()
    paidAt: string; // ISO date string

    @IsNotEmpty()
    @IsMongoId()
    paidBy: string; // paidBy is a user ID string from the client

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SplitDetailDto)
    splitDetails?: SplitDetailDto[];
}