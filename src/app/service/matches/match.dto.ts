export class Match {
  id: string;
  home: String;
  away: String;
  start: Date;
  result: MatchResult;

  constructor(id?: string, home?: string, away?: string, start?: Date, result?: MatchResult) {
    this.id = id;
    this.home = home;
    this.away = away;
    this.start = start;
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
  toString() {
    return this.home + '-' + this.away;
  }
}

export enum MatchFlag {
  HOME,
  AWAY,
  EQ
}
