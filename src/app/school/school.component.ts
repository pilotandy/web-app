import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-school',
    templateUrl: './school.component.html',
})
export class SchoolComponent implements OnInit {
    selectedCourse = false;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.selectedCourse = false;
    }

    onSelectCourse(route: string): void {
        this.selectedCourse = true;
        const url = '../' + route;
        console.log(url, this.activatedRoute.parent);
        //this.router.navigate([url], { relativeTo: this.activatedRoute.parent });
    }
}
