import {Match} from '../matches/match.dto';
import {PointRule} from './rule.dto';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class RootContextDto {
  type: string;
  year: number;
  name: string;
  id: string;
  start: Timestamp;
  isActive: boolean;
  rule: PointRule;
  constructor(year?: number, type?: string, start?: Timestamp) {
    this.year = year;
    this.type = type;
    this.start = start;
    this.rule = new PointRule();
  }
}

export class MatchContextDto {
  id: string;
  name: string;
  parent: string;


  constructor(parent?: string, name?: string) {
    this.parent = parent;
    this.name = name;
  }
}

export class MatchContext {
  id: string;
  name: string;
  finished: boolean;
  parent: MatchContext;
  children: Array<MatchContext>;
  // TODO isRunning: boolean;
  matches: Array<Match>;

  constructor(id?: string, name?: string) {
    this.id = id;
    this.name = name;
    this.children = [];
  }

  static createFromDto(matchDto: MatchContextDto) {
    return new MatchContext(matchDto.id, matchDto.name);
  }

  get rootId() {
    return this.parent ? this.parent.rootId : this.id;
  }

  getRoot(): RootContext {
    return (this.parent ? this.parent.getRoot() : this) as RootContext;
  }

  getFirstChildren() {
    return this.children.length ? this.children[0].getFirstChildren() : this;
  }

  add(parentId: string, context: MatchContext) {
    const parent = this.find(parentId);
    parent.children.push(context);
    context.parent = parent;
  }

  find(id: string): MatchContext {
    if (this.id === id) {
      return this;
    } else {
      for (let i = 0; i < this.children.length; i++) {
        const find = this.children[i].find(id);
        if (find) {
          return find;
        }
      }
      return undefined;
    }
  }
}

export class RootContext extends MatchContext {
  type: string;
  year: number;
  start: Date;
  isActive: boolean;
  rule: PointRule;
  constructor(type?: string, year?: number) {
    super(year + '_' + type, year + ' ' + type);
    this.type = type;
    this.year = year;
    this.rule = new PointRule();
  }

  static fromDto(contextDto: RootContextDto) {
    const context = new RootContext(contextDto.type, contextDto.year);
    context.start = contextDto.start ? new Date(contextDto.start.seconds * 1000) : null;
    context.rule = contextDto.rule;
    context.children = [];
    return context;
  }
}
