export interface namespace {
  name: string;
  value: string;
}

export interface service {
  name: string;
  port: number;
  value: number;
}

export interface configFile {
  services: Omit<service, 'value'>[];
  namespaces: string[];
}

export interface configurations {
  services: service[];
  namespaces: namespace[];
}
