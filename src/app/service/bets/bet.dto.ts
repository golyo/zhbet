import {Match, MatchResult, Team} from '../matches/match.dto';

export class UserBetPoint {
  user: string;
  teamPoint: number;
  roundPoint: number;
  summ: number;
}

export class MatchResultBet extends Match {
  betId: string;
  user: string;
  bet: MatchResult;
  point: number;
  constructor(match: Match, bet: BetDto) {
    super(match.id, match.home, match.away, match.start, match.result);
    if (bet) {
      this.betId = bet.id;
      this.user = bet.user;
      this.bet = MatchResult.fromString(bet.bet);
      this.point = bet.point;
    }
  }
}

export class BetDto {
  id: string;
  user: string;
  matchId: string;
  bet: string;
  point: number;
  constructor(id: string, user: string, matchId: string, bet: string, point?: number) {
    this.id = id;
    this.user = user;
    this.matchId = matchId;
    this.bet = bet;
    this.point = point;
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
