import {Component, OnInit} from '@angular/core';
import {ContextService} from '../../service/context/context.service';
import {MatchContext} from '../../service/context/context.dto';


@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  constructor(contextService: ContextService) { }

  ngOnInit() {
  }

  onSelectNode(context: MatchContext) {
  }
}
