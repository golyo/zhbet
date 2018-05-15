import {MatchResult} from '../matches/match.dto';

export class PointRule {
  winner: number;
  diff: number;
  diffModifier: number;
  fixGoal: number;
  fixGoalModifier: number;
  teamWin: number;
  teamWinModifier: number;
}
