import os from 'os';

export const logPath = '/tmp/log/port-forward';
export const configPath = os.homedir() + '/.pf';
export const configExamplePath = __dirname + '/example.json';
