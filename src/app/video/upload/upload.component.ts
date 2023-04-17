import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import { last, switchMap } from 'rxjs';
import { v4 as uuid} from 'uuid'
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clip.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy{
  isDragover = false
  file: File | null = null
  nextStep = false
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Uploading'
  inSubmission = false
  percentage = 0
  showPercentage = false
  user: firebase.User | null = null
  task?: AngularFireUploadTask

  title = new FormControl('',{
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  })
  uploadForm = new FormGroup({
    title: this.title
  })

  constructor(
    private storage: AngularFireStorage, 
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router,
    ) {
      this.auth.user.subscribe(user => this.user = user)
    }

  storeFile(event: Event) {
    this.isDragover = false
    this.file = (event as DragEvent).dataTransfer ? (event as DragEvent).dataTransfer?.files.item(0) ?? null : 
    (event.target as HTMLInputElement).files?.item(0) ?? null

    if(!this.file || this.file.type !== 'video/mp4') {
      return
    }

    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/,'')
    )
    this.nextStep = true
  }

  uploadFile() {
    this.uploadForm.disable()
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Uploading'
    this.inSubmission = true

    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`

    this.task = this.storage.upload(clipPath, this.file)
    const clipRef = this.storage.ref(clipPath)

    this.task.percentageChanges().subscribe(progress => {
      this.showPercentage = true
      this.percentage = progress as number / 100
    })
    this.task.snapshotChanges().pipe(last(),switchMap(() => clipRef.getDownloadURL())).subscribe({
      next: async url => {
        const clip = {
          uid: this.user?.uid,
          displayName: this.user?.displayName,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }

        const clipRef = await this.clipService.createClip(clip as IClip)

        this.alertColor = 'green'
        this.alertMsg = 'Success'
        this.showPercentage = false

        setTimeout(() => {
          this.router.navigate([
            'clip', clipRef.id
          ])
        },1000)
      },
      error: e => {
        this.uploadForm.enable()
        this.alertColor = 'red'
        this.alertMsg = 'Fail'
        this.showPercentage = false
        this.inSubmission = true
        console.error(e)
      }
    })
  }

  ngOnDestroy(): void {
    this.task?.cancel()
  }
}
