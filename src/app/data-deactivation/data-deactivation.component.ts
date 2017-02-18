import { Component, OnInit,ViewContainerRef,ElementRef} from '@angular/core';
import { DialogService } from '../service/dialog.service';

@Component({
  selector: 'app-data-deactivation',
  templateUrl: './data-deactivation.component.html',
  styleUrls: ['./data-deactivation.component.scss']
})
export class DataDeactivationComponent implements OnInit {

  constructor(private dialogService: DialogService,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef) { }

  ngOnInit() {
  }

  search() {

    this.dialogService.confirm('Escolha', '', 'TABLE', this.viewContainerRef).subscribe((value) => {
      //  TODO - IMPLEMENTAR A LOGICA QUE VALIDA OU NAO O APIARIO
    });
  }

}
