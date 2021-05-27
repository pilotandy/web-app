import { User, UserService } from 'src/app/user/user.service';
import { PreSoloService, Question, Answer } from './presolo.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-presolo',
    templateUrl: './presolo.html',
    styleUrls: ['./presolo.scss'],
})
export class PreSoloComponent implements OnInit, OnDestroy {
    @Input() open = true;
    @Input() user: User | null;
    private subs: Subscription[] = [];
    saving = -1;
    saved = -1;

    questions: Question[] = [];
    answers: Answer[] = [];

    constructor(
        private presoloService: PreSoloService,
        private userService: UserService,
        private location: Location,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.presoloService.getQuestions().then((q) => {
            this.questions = q;
        });
        if (this.user && this.user.private && this.user.private.presolo) {
            this.answers = this.user.private.presolo.answers;
        } else {
            this.subs.push(
                this.userService.currentUser.subscribe((u) => {
                    if (u.groups.includes('Flight Instructor')) {
                        this.route.params.subscribe((params: Params) => {
                            if (params.id) {
                                const id = Number(params.id);
                                // push all users, get by id
                                this.userService.allUsers.subscribe((users) => {
                                    const user = users.find((usr) => {
                                        return usr.id === id;
                                    });
                                    if (
                                        user &&
                                        user.private &&
                                        user.private.presolo
                                    ) {
                                        this.user = user;
                                        this.answers =
                                            user.private.presolo.answers;
                                    }
                                });
                            }
                        });
                    } else {
                        this.user = u;
                        this.answers = u.private.presolo.answers;
                    }
                })
            );
        }
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => {
            s.unsubscribe();
        });
    }

    goBack() {
        this.location.back();
    }

    loadAnswer(id: number) {
        const answer = this.answers.find((a) => {
            return a.id === id;
        });
        if (answer) {
            return answer.text;
        }
        return '';
    }

    onChangeAnswer(id: number, event: any) {
        const text = event.target.value;
        const answer = this.answers.find((a) => {
            return a.id === id;
        });
        if (answer) {
            answer.text = text;
        } else {
            this.answers.push({
                id,
                text,
            });
        }
    }

    onSave(id: number) {
        this.saving = id;
        this.saved = -1;
        this.presoloService.save(this.answers).then(
            () => {
                this.saving = -1;
                this.saved = id;
            },
            () => {
                this.saving = -1;
                this.saved = -1;
            }
        );
    }
}
