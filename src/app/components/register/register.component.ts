import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

// call to api service
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RegisterDTO } from '../../dtos/user/register.dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  // lấy #registerForm trong biến tham chiếu tại html gán vào biến registerForm tại component 
  // mục đích là để lấy giá trị của form 
  @ViewChild('registerForm') registerForm!: NgForm;

  // giong properties
  phoneNumber: string = '';
  password: string = '';
  retypePassword: string = '';
  fullName: string = '';
  dateOfBirth: Date = new Date();
  address: string = '';
  isAccepted: boolean = false; 


  // anh xa voi [(ngModel)]
  constructor( private router: Router,private userService:UserService) { 
    // this.phoneNumber="";
    // this.password="";
    // this.retypePassword="";
    // this.fullName="";
    // this.dateOfBirth=new Date();
    // this.address="";
    // this.isAccepted=false;
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear()-18);
  }

  onPhoneNumberChange(){
    console.log("Phone changed: ", this.phoneNumber);
  }

  register(){
    // gọi api đăng ký
    const registerDTO:RegisterDTO  = {
        "full_name": this.fullName,
        "phone_number": this.phoneNumber,
        "address": this.address,
        "password": this.password,
        "retype_password": this.retypePassword,
        "date_of_birth": this.dateOfBirth,
        "facebook_account_id": "",
        "google_account_id": "",
        // "role_id": 1 //        // 1: user, 2: admin
    };

    this.userService.register(registerDTO).subscribe({
      next:(response:any) => {
        debugger      
        if(response.status===200||response.status===201){
          this.router.navigate(['/login']);
        }else{

        }
      },  
      complete:() => {
        debugger
      },
      error:(error:any) => {
        debugger
        console.error("Error: ", error);
      }
    })

    
  }

  checkPasswordsMatch() {
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword'].setErrors({'mismatch': true });
    } else {
      this.registerForm.form.controls['retypePassword'].setErrors(null);
    }
  }
  

  checkAge() {
    if(this.dateOfBirth) {
      const today = new Date();
      const dateOfBirth = new Date(this.dateOfBirth);
      const age = today.getFullYear() - dateOfBirth.getFullYear();
      const monthDiff = today.getMonth() - dateOfBirth.getMonth();
      const dayDiff = today.getDate() - dateOfBirth.getDate();
  
      // Nếu độ tuổi nhỏ hơn 18
      if (age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({'invalidAge': true});
      } else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null); // Remove the error if age is valid
      }
    }
  }
  



}
