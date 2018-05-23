import {Component, Input} from '@angular/core';
import {MatchContext} from '../../../service/context/context.dto';
import {NewContextModalComponent} from '../new-context-modal/new-context-modal.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-tab-tree',
  templateUrl: './tab-tree.component.html'
})
export class TabTreeComponent {

  @Input()
  parent: MatchContext;

  constructor(private dialog: MatDialog) {
  }

  onSelectTab(event) {
    console.log('On Select tab', event);
  }

  addNewGroup() {
    this.dialog.open(NewContextModalComponent, {
      width: '500px',
      data: {
        root: this.parent.rootId,
        parent: this.parent.id
      }
    });
  }

  addNewMatch() {
  }
}