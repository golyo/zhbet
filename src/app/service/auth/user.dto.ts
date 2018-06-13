export class User {
  id: string;
  name: string;
  email: string;
  context: string;
  point: number;
  teamPoint: number;
  betPoint: number;
  roles: Array<string>;

  constructor(id?: string, name?: string, email?: string, context?: string, point?: number, teamPoint?: number, betPoint?: number, roles?: Array<string>) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.context = context;
    this.point = point;
    this.teamPoint = teamPoint;
    this.betPoint = betPoint;
    this.roles = roles;
  }

  isAdmin(): boolean {
    return this.roles && this.roles.indexOf('ADMIN') >= 0;
  }
}
