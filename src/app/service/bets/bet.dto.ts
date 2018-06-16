import {Match, MatchResult} from '../matches/match.dto';

export class MatchResultBet extends Match {
  betId: string;
  user: string;
  bet: MatchResult;
  point: number;
  isRunning: boolean;
  constructor(match: Match, bet: BetDto) {
    super(match.id, match.home, match.away, match.start, match.result);
    this.isRunning = match.isRunning;
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

export class TeamBetDto {
  userId: string;
  teams: Array<string>;

  constructor(userId?: string, point?: number, teams?: Array<string>) {
    this.userId = userId;
    this.teams = teams || new Array<string>(4).fill(null);
  }
}
