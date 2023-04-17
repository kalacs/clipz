import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: 'test@test.com',
    password: 'Q1w2e3r4'
  }
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait'
  inSubmission =false

  constructor(private auth: AngularFireAuth) {}

  async login() {
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait'
    this.inSubmission = true
    try {

      await this.auth.signInWithEmailAndPassword(this.credentials.email, this.credentials.password)
    } catch (error) {
      this.alertColor = 'red'
      this.alertMsg = 'Error'
      this.inSubmission = false
      return
    }
    this.alertColor = 'green'
    this.alertMsg = 'OK'


  }
}
