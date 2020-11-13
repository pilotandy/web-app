import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class TemplateService {
    isSideNavCollapse = false;
    isSidePanelOpen = false;
    rtlActived = false;

    private isSideNavCollapseActived = new BehaviorSubject<boolean>(
        this.isSideNavCollapse
    );
    isSideNavCollapseChanges: Observable<
        boolean
    > = this.isSideNavCollapseActived.asObservable();

    private isSidePanelOpenActived = new BehaviorSubject<boolean>(
        this.isSidePanelOpen
    );
    isSidePanelOpenChanges: Observable<
        boolean
    > = this.isSidePanelOpenActived.asObservable();

    toggleSideNavCollapse(isCollapse: boolean) {
        this.isSideNavCollapseActived.next(isCollapse);
    }

    toggleSidePanelOpen(isOpen: boolean) {
        this.isSidePanelOpenActived.next(isOpen);
    }
}
