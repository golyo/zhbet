export class User {
  name: string;
  email: string;
  roles: Array<string>;

  constructor(name?: string, email?: string, roles?: Array<string>) {
    this.name = name;
    this.email = email;
    this.roles = roles;
  }
}
