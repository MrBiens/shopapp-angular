import { Role } from "src/app/models/role";

export interface UserResponse{
    id:number;
    full_name:string;
    phone_number:string;
    email:string;
    date_of_birth:Date;
    address:string;
    role_id:number;
    is_active?:boolean;
    facebook_account_id:string;
    google_account_id:string;
    role_response:Role;


}