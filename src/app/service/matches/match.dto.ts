export class Match {
  home: Team;
  away: Team;
  start: Date;
  result: MatchResult;
}

export class Team {
  id: string;
  name: string;
  point: number;
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
}

export enum MatchFlag {
  HOME,
  AWAY,
  EQ
}
