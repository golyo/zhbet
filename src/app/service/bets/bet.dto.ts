import {Round} from '../context/context.dto';
import {MatchResult, Team} from '../matches/match.dto';

export class ContextBet {
  user: string;
  teamPoint: number;
  roundPoint: number;
  summ: number;
}

export class RoundBet {
  round: Round;
  user: string;
  results: Array<MatchResult>;
  point: number;
}

export class WinnerBet {
  user: string;
  teams: Array<Team>;
}
