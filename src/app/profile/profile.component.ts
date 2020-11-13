import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User, UserService } from '../user/user.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['profile.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    user: User;
    viewer: User;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.subs.push(
            this.route.params.subscribe((params) => {
                if (params && params.id) {
                    const id = Number(params.id);
                    this.subs.push(
                        this.userService.allUsers.subscribe((users: User[]) => {
                            if (users.length > 0) {
                                this.user = users.find((u) => {
                                    return u.id === id;
                                });
                            }
                        })
                    );
                } else {
                    this.subs.push(
                        this.userService.currentUser.subscribe((user) => {
                            this.viewer = user;
                            if (this.user !== null) {
                                this.user = user;
                            }
                        })
                    );
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    onImageUpload(event): void {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            const file: File = fileList[0];
            const reader = new FileReader();

            // loader callback
            reader.addEventListener(
                'load',
                () => {
                    // convert image file to base64 string
                    const toSave = JSON.parse(JSON.stringify(this.user));
                    toSave.data.image = reader.result.toString();
                    this.userService.saveUser(toSave).subscribe(
                        (user: User) => {
                            this.user = user;
                        },
                        (error) => {
                            alert('could not save the user!');
                        }
                    );
                },
                false
            );
            // load image
            if (file) {
                reader.readAsDataURL(file);
            }

            // formData.append('uploadFile', file, file.name);
            // let headers = new Headers();
            // /** In Angular 5, including the header Content-Type can invalidate your request */
            // headers.append('Content-Type', 'multipart/form-data');
            // headers.append('Accept', 'application/json');
            // let options = new RequestOptions({ headers: headers });
            // this.http
            //     .post(`${this.apiEndPoint}`, formData, options)
            //     .map((res) => res.json())
            //     .catch((error) => Observable.throw(error))
            //     .subscribe(
            //         (data) => console.log('success'),
            //         (error) => console.log(error)
            //     );
        }
    }
}
