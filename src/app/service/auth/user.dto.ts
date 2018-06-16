export class User {
  id: string;
  name: string;
  email: string;
  context: string;
  teamPoint: number;
  betPoint: number;
  roles: Array<string>;

  constructor(id?: string, name?: string, email?: string, context?: string, teamPoint?: number, betPoint?: number, roles?: Array<string>) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.context = context;
    this.teamPoint = teamPoint || 0;
    this.betPoint = betPoint || 0;
    this.roles = roles;
  }

  isAdmin(): boolean {
    return this.roles && this.roles.indexOf('ADMIN') >= 0;
  }
}

export class UserPointDiff {
  userId: string;
  teamPoint: number;
  betPoint: number;

  constructor(userId: string, teamPoint?: number, betPoint?: number) {
    this.userId = userId;
    this.teamPoint = teamPoint || 0;
    this.betPoint = betPoint || 0;
  }
}
