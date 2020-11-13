import { Component } from '@angular/core';
import { TemplateService } from '../../shared/services/template.service';

@Component({
    selector: 'app-side-panel',
    templateUrl: './side-panel.component.html'
})
export class SidePanelComponent  {

    isOpen: boolean

    constructor(private tplSvc: TemplateService) {
    }

    ngOnInit(): void {
        this.tplSvc.isSidePanelOpenChanges.subscribe(isOpen => this.isOpen = isOpen);
    }

    toggleSidePanelOpen() {
        this.isOpen = !this.isOpen;
        this.tplSvc.toggleSidePanelOpen(this.isOpen);
    }
}
