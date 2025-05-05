export interface DatabaseConfig {
  type: string;
  url?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  entities?: Array<string>;
  migrations?: Array<string>;
}
