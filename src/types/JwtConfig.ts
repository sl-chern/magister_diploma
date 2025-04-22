export interface JwtConfig {
  secret: string;
  signOptions: {
    expiresIn: string;
  };
}
