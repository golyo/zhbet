import {Component, Inject, OnInit} from '@angular/core';
import {ContextService} from '../../../service/context/context.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import {ZhBetErrorStateMatcher} from '../../../util/error-state-matcher';
import {RootContextDto} from '../../../service/context/context.dto';

@Component({
  selector: 'app-new-root-context-modal',
  templateUrl: './new-root-context-modal.component.html'
})
export class NewRootContextModalComponent implements OnInit {
  yearControl = new FormControl('', [Validators.required]);
  nameControl = new FormControl('', [Validators.required]);
  matcher = new ZhBetErrorStateMatcher();

  constructor(private dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any,
              private service: ContextService) {
  }

  ngOnInit() {
  }

  createNew() {
    this.service.addRootContext(this.yearControl.value, this.nameControl.value);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}
