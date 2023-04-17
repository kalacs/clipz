import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { EmailTaken } from '../validators/email-taken';
import { RegisterValidators } from '../validators/register-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = new FormControl('Test', [
    Validators.required,
    Validators.minLength(3)
  ])
  email= new FormControl('test@test.com',
  [
    Validators.required,
    Validators.email,
  ], [this.emailTaken.validate])
  age= new FormControl<number | null>(null,
  [
    Validators.required,
    Validators.min(18),
    Validators.max(120)
  ])
  password= new FormControl('Q1w2e3r4', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ])
  confirmPassword= new FormControl('Q1w2e3r4',[
    Validators.required,
  ])
  phoneNumber= new FormControl('(111)111-1111',[
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13)
  ])
  showAlert = false
  alertMsg = 'Please wait'
  alertColor = 'blue'
  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber,
  }, [RegisterValidators.match('password', 'confirmPassword')])
  inSubmission = false

  constructor(private auth: AuthService, private emailTaken: EmailTaken)  {}
  async register() {
    this.showAlert = true
    this.alertMsg = 'Please wait'
    this.alertColor = 'blue'
    this.inSubmission = true

    try {
      await this.auth.createUser(this.registerForm.value as IUser);
    } catch (e) {
      console.error(e)      
      this.alertMsg = 'An unexpected error occured. Try again';
      this.alertColor = 'red'
      this.inSubmission = false
      return
    }
    this.alertMsg = 'Success'
    this.alertColor = 'green'
  }
}
