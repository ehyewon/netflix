import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../toast/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {

    visible = false;
    message = '';
    type: 'success' | 'error' | 'info' = 'info';

    constructor(private toastService: ToastService) { }

    ngOnInit() {
        this.toastService.toastState.subscribe(toast => {
            this.message = toast.message;
            this.type = toast.type;

            this.visible = true;
            setTimeout(() => (this.visible = false), 2000);
        });
    }
}
