import {Match} from '../matches/match.dto';
import {PointRule} from './rule.dto';

export class MatchRootContextDto {
  id: string;
  game: string;
  year: number;
  rule: PointRule;
}

export class MatchContextDto {
  constructor(id?: string, root?: string, parent?: string, name?: string, year?: number) {
    this.id = id;
    this.root = root;
    this.parent = parent;
    this.name = name;
    this.year = year;
  }

  id: string;
  name: string;
  year: number;
  root: string;
  parent: string;
}

export class MatchContext {
  id: string;
  name: string;
  year: number;
  parent: MatchContext;
  children: Array<MatchContext>;
  isActive: boolean;

  constructor(id?: string, name?: string, year?: number) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.children = [];
  }

  static createFromDto(matchDto: MatchContextDto) {
    return new MatchContext(matchDto.id, matchDto.name, matchDto.year);
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
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].id === id) {
        return this.children[i];
      } else {
        const find = this.children[i].find(id);
        if (find) {
          return find;
        }
      }
    }
    return undefined;
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
