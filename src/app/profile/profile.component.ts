import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotifyService, NotifyType } from '../shared/services/notify.service';
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

    notifyTypes: NotifyType[];

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private notifyService: NotifyService
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

        this.notifyService.types().then((types: NotifyType[]) => {
            this.notifyTypes = types;
        });
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
                    this.userService.saveUser(toSave).then(
                        (user: User) => {
                            this.user = user;
                        },
                        (error) => {}
                    );
                },
                false
            );

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    }

    onChangePhone(phone) {
        console.log(phone);
    }

    systemType() {
        return {
            email: false,
            sms: false,
        };
    }

    onEmailNotifyChange(systemId) {
        const user = JSON.parse(JSON.stringify(this.user));
        let n = user.notifications[systemId];
        if (!n) {
            n = this.systemType();
        }
        n.email = !n.email;
        user.notifications[systemId] = n;

        this.userService.saveUser(user).then((u: User) => {
            this.user = u;
        });
    }

    onSMSNotifyChange(systemId) {
        const user = JSON.parse(JSON.stringify(this.user));
        let n = user.notifications[systemId];
        if (!n) {
            n = this.systemType();
        }
        n.sms = !n.sms;
        user.notifications[systemId] = n;

        this.userService.saveUser(user).then((u: User) => {
            this.user = u;
        });
    }
}
