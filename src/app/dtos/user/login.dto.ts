import {IsString, IsNotEmpty,IsPhoneNumber, IsEmail, ValidateIf} from 'class-validator';

export class LoginDTO{
    @IsNotEmpty()
    @IsString()
    user_name: string;

    @ValidateIf(o => o.user_name.includes('@')) // Kiểm tra nếu user_name có dạng email
    @IsEmail()
    email?: string;

    @ValidateIf(o => !o.user_name.includes('@')) // Kiểm tra nếu user_name có dạng số điện thoại
    @IsPhoneNumber('VN') // Thay 'VN' bằng mã quốc gia phù hợp
    phoneNumber?: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    constructor(data:any){
        this.user_name = data.user_name ;
        this.password = data.password ;
    }


}