import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';
import {Observable, of} from 'rxjs';
import {MatchContext} from '../../../service/context/context.dto';
import {ContextService} from '../../../service/context/context.service';

export class MatchContextNode {
  id: string;
  name: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'app-context-tree',
  templateUrl: './context-tree.component.html',
  styleUrls: ['./context-tree.component.css']
})
export class ContextTreeComponent implements OnInit {

  // context: RootContext;
  treeControl: FlatTreeControl<MatchContextNode>;
  treeFlattener: MatTreeFlattener<MatchContext, MatchContextNode>;
  dataSource: MatTreeFlatDataSource<MatchContext, MatchContextNode>;
  selectedId: string;
  @Output()
  selectNode = new EventEmitter<MatchContext>();

  constructor(private contextService: ContextService) { }

  ngOnInit() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<MatchContextNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.contextService.getSelectedContext().subscribe(context => {
      if (context) {
        this.dataSource.data = [context];
        this.treeControl.expandAll();
      }
    });
  }

  transformer = (context: MatchContext, level: number) => {
    const node = new MatchContextNode();
    node.id = context.id;
    node.name = context.name;
    node.level = level;
    node.expandable = context.children.length > 0;
    return node;
  }

  hasChild = (_: number, _nodeData: MatchContextNode) => {
    return _nodeData.expandable;
  }

  onSelect(nodeId: string) {
    this.selectedId = nodeId;
    this.selectNode.emit(this.dataSource.data[0].find(nodeId));
  }

  private _getLevel = (node: MatchContextNode) => {
    return node.level;
  }

  private _isExpandable = (node: MatchContextNode) => {
    return node.expandable;
  }

  private _getChildren = (node: MatchContext): Observable<MatchContext[]> => {
    return of(node.children);
  }
}
