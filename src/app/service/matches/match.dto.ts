export const RESULT_DELIM = '-';

export class Match {
  id: string;
  home: string;
  away: string;
  start: Date;
  result: MatchResult;
  isRunning: boolean;

  constructor(id?: string, home?: string, away?: string, start?: Date, result?: MatchResult) {
    this.id = id;
    this.home = home;
    this.away = away;
    this.start = start;
    this.isRunning = start &&  (new Date().getTime() > start.getTime());
    this.result = result;
  }
}

export class Team {
  id: string;
  name: string;
  point: number;

  constructor(id?: string, name?: string, point?: number) {
    this.id = id;
    this.name = name;
    this.point = point;
  }
}

export class MatchResult {
  home: number;
  away: number;
  result: MatchFlag;

  constructor(home: number, away: number) {
    this.home = home;
    this.away = away;
    if (this.home > this.away) {
      this.result = MatchFlag.HOME;
    } else if (this.home < this.away) {
      this.result = MatchFlag.AWAY;
    } else {
      this.result = MatchFlag.EQ;
    }
  }
  static fromString(resultStr: string): MatchResult {
    if (!resultStr) {
      return null;
    }
    const results = resultStr.split(RESULT_DELIM);
    return results.length === 2 ? new MatchResult(parseInt(results[0]), parseInt(results[1])) : undefined;
  }
  toString() {
    return this.home + '-' + this.away;
  }
}

export enum MatchFlag {
  HOME,
  AWAY,
  EQ
}
