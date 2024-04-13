export class SignUpInfo {
  name: string;
  email: string;
  roles: string[];
  password: string;

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.roles = ['user'];
  }
}
