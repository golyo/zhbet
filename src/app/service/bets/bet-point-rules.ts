import {TeamBetDto} from './bet.dto';
import {Match, MatchFlag, MatchResult} from '../matches/match.dto';
import {PointRule} from '../context/rule.dto';

export class BetPointRule {
  teamWin = 3;
  teamDraw = 1;
  teamForward = 3;
  betResultSame = 2;
  goalEqual = 1;
  diffEqual = 1;

  getTeamBetPoint(teamBet: TeamBetDto, match: Match): number {
    let point = 0;
    if (match.result.result === MatchFlag.HOME) {
      if (teamBet.teams.findIndex(team => team === match.home) >= 0) {
        point += this.teamWin;
      }
    } else if (match.result.result === MatchFlag.AWAY) {
      if (teamBet.teams.findIndex(team => team === match.away) >= 0) {
        point += this.teamWin;
      }
    } else {
      if (teamBet.teams.findIndex(team => team === match.home) >= 0) {
        point += this.teamDraw;
      }
      if (teamBet.teams.findIndex(team => team === match.away) >= 0) {
        point += this.teamDraw;
      }
    }
    return point;
  }

  getMatchBetPoint(bet: MatchResult, match: Match): number {
    if (!bet) {
      return null;
    }
    let point = 0;
    if (bet.home === match.result.home) {
      point += this.goalEqual;
    }
    if (bet.away === match.result.away) {
      point += this.goalEqual;
    }
    if (Math.sign(bet.home - bet.away) === Math.sign(match.result.home - match.result.away)) {
      point += this.betResultSame;
      if (bet.home - bet.away === match.result.home - match.result.away) {
        point += this.diffEqual;
      }
    }
    return point;
  }
}

export const POINT_RULE = new BetPointRule();
