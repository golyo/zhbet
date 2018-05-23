import {Component, Inject, OnInit} from '@angular/core';
import {ContextService} from '../../../service/context/context.service';
import {NewTeamComponent} from '../../team/new-team/new-team.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import {ZhBetErrorStateMatcher} from '../../../util/error-state-matcher';

@Component({
  selector: 'app-new-context-modal',
  templateUrl: './new-context-modal.component.html'
})
export class NewContextModalComponent implements OnInit {
  yearControl = new FormControl('', [Validators.required]);
  nameControl = new FormControl('', [Validators.required]);
  matcher = new ZhBetErrorStateMatcher();

  constructor(private dialogRef: MatDialogRef<NewTeamComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private service: ContextService) {
    console.log('OPEN NEW GROUP WITH DATA', data);
  }

  ngOnInit() {
  }

  createNew() {
    if ((this.data.parent !== 'ROOT' || this.yearControl.valid) && this.nameControl.valid) {
      this.service.addContext(this.data.root, this.data.parent, this.nameControl.value, this.yearControl.value).subscribe((result) => {
        this.dialogRef.close(result);
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

}
