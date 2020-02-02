import os from 'os';
import fs from 'fs';
import util from 'util';
import { configFile, configurations } from '../types';

export const logPath = '/tmp/log/port-forward';
export const configPath = os.homedir() + '/.pf';
export const configExamplePath = __dirname + '/example.json';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

export const getConfigurationObject = async () => {
  try {
    const fileBuffer = await readFile(configPath);
    if (!fileBuffer) throw new Error('file not exists');

    return JSON.parse(fileBuffer.toString()) as configFile;
  } catch (error) {
    console.error('An error ocurred while reading the file ', error);
  }
};

export const saveConfigurations = async (config: string) => {
  try {
    await writeFile(configPath, config);
    console.log('COnf save');
  } catch (error) {
    console.error('An error ocurred while reading the file ', error);
  }
};

export const addService = async (name: string, port: number) => {
  const { namespaces, services } = await getConfigurationObject();
  services.push({ name, port });

  saveConfigurations(JSON.stringify({ services, namespaces }, null, 2));
};

export const loadConfiguration = async () => {
  const { namespaces, services } = await getConfigurationObject();
  return {
    services: services.map((service, index) => ({ ...service, value: index })),
    namespaces: namespaces.map(namespace => ({ name: namespace, value: namespace }))
  } as configurations;
};
