import {Injectable} from '@angular/core';
import {MatchContext} from './context.dto';
import {Match, MatchResult} from '../matches/match.dto';

@Injectable()
export class ContextSrevice {
  matchContext: MatchContext;


  private saveMatchResult(match: Match, result: MatchResult) {
    match.result = result;
    // TODO save match;
    // TODO get match bets;
    const matchBets: Array<MatchResult> = [];
    // TODO calculate and save points
  }

  private calculate(result: MatchResult, bet: MatchResult): number {
    const rule = this.matchContext.rule;
    return 0;
  }
}
