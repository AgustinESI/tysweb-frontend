import { Component } from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {

  private id_alert = 'alert-success';
  constructor(private configAlert: NgbAlertConfig) {
    configAlert.type = 'success';
    configAlert.dismissible = true;
  }

  close(_id: string) {
    var element = document.getElementById(_id);
    if (element) {
      element.style.display = 'none'
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.close(this.id_alert);
    }, 5000);
  }
}
