import {Match, Team} from '../matches/match.dto';
import {PointRule} from './rule.dto';

export class MatchContext {
  id: string;
  game: string;
  year: number;
  rule: PointRule;
}

export class MatchDetailsContextDto {
  id: string;
  rootContext: string;
  parentContext: string;
  name: string;
}

export class Round {
  id: string;
  parentContext: string;
  rootContext: string;
  name: string;
  matches: Array<Match>;
  isActive: boolean;
}
