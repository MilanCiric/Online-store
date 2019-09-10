import { Component, Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { BackendService } from '../../services/backend.service';

@Component({
    selector: 'fileupload',
    templateUrl: './fileupload.component.html',
    styleUrls: ['./fileupload.component.css']
})
export class FileUploadComponent {
    @Input() fileUrl: string;
    @Input() docId: string;
    task: AngularFireUploadTask;
    percentage: Observable<number>;
    snapshot: Observable<any>;
    downloadURL: Observable<string>;
    isHovering: boolean;
    error: boolean = false;

    constructor(private _storage: AngularFireStorage, private _backendService: BackendService) { }

    toggleHover(event: boolean) {
        this.isHovering = event;
    }

    startUpload(event: FileList) {
        const file = event.item(0);
        if (file.type.split('/')[0] !== 'image') {
            this.error = true;
            console.log('unsupporterd file type');
            return;
        } else {
            this.error = false;
        }
        const filePath = 'onlinestore/Milan/' + this.fileUrl + '/' + new Date().getTime();
        const fileRef = this._storage.ref(filePath);
        const task = this._storage.upload(filePath, file);
        this.percentage = task.percentageChanges();

        this.task = this._storage.upload(filePath, file);
        this.percentage = this.task.percentageChanges();
        this.task.snapshotChanges().pipe(
            finalize(() => {
                //this.downloadURL = fileRef.getDownloadURL();
                console.log(filePath);
                if (this.fileUrl == 'users')
                    return this._backendService.setUserPic(filePath, this.fileUrl, this.docId);
                else
                    return this._backendService.setPic(filePath, this.fileUrl, this.docId);
            })
        ).subscribe();

    }

    isActive(snapshot) {
        return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
    }
}