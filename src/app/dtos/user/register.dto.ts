import{ IsString, IsNotEmpty, IsEmail, IsDate, IsOptional, IsPhoneNumber } from 'class-validator';

export class RegisterDTO{
    @IsString()
    @IsNotEmpty()
    full_name: string;

    @IsPhoneNumber()
    phone_number: string;

    @IsString()
    address: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    retype_password: string;

    @IsDate()
    date_of_birth: Date;

    facebook_account_id: string;

    google_account_id: string;

    role_id: number; // 1: user, 2: admin

    constructor(data:any){
        this.full_name = data.full_name || '';
        this.phone_number = data.phone_number || '';
        this.address = data.address || '';
        this.password = data.password || '';
        this.retype_password = data.retype_password || '';
        this.date_of_birth = data.date_of_birth || new Date();
        this.facebook_account_id = data.facebook_account_id || '';
        this.google_account_id = data.google_account_id || '';
        this.role_id = data.role_id || 1; // Default to user role
    }

}