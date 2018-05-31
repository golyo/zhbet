import {Round} from '../context/context.dto';
import {Match, MatchResult, Team} from '../matches/match.dto';

export class UserBetPoint {
  user: string;
  teamPoint: number;
  roundPoint: number;
  summ: number;
}

export class MatchResultBet extends Match {
  matchId: string;
  constructor(matchId: string, home: string, away: string) {
    super(home, away);
    this.matchId = matchId;
  }
}

export class BetContext {
  user: string;
  contextId: string;
  results: Array<MatchResultBet>;
  point: number;
  constructor(user: string, contextId: string, results: Array<MatchResultBet>, point: number) {
    this.user = user;
    this.contextId = contextId;
    this.results = results;
    this.point = point;
  }
}

export class WinnerBet {
  user: string;
  teams: Array<Team>;
}
