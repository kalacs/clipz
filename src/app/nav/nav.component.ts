import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  constructor(
    public modalService: ModalService, 
    public auth: AuthService, 
    private afAuth: AngularFireAuth,
    private router: Router
  ){}

  openModal(event: MouseEvent){
    event.preventDefault()
    this.modalService.toggleModal('auth')
  }

}
