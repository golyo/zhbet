import {Match} from '../matches/match.dto';
import {PointRule} from './rule.dto';

export class RootContextDto {
  type: string;
  year: number;
  name: string;
  id: string;
  isActive: boolean;
  rule: PointRule;
  constructor(year?: number, type?: string) {
    this.year = year;
    this.type = type;
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
    context.rule = contextDto.rule;
    context.children = [];
    return context;
  }
}

export class Round {
  id: string;
  parentContext: string;
  rootContext: string;
  name: string;
  matches: Array<Match>;
  isActive: boolean;
}
