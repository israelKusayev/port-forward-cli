import childProcess from 'child_process';
import util from 'util';
import inquirer from 'inquirer';
import fs from 'fs';
import inquirerTablePrompt from 'inquirer-table-prompt';
import { configPath, logPath } from '../config';
import { configurations, configFile } from '../types';

const exec = util.promisify(childProcess.exec);
const readFile = util.promisify(fs.readFile);

const loadConfiguration = async () => {
  try {
    const fileBuffer = await readFile(configPath);
    if (!fileBuffer) throw new Error('file not exists');
    const { namespaces, services } = JSON.parse(fileBuffer.toString()) as configFile;
    return {
      services: services.map((service, index) => ({ ...service, value: index })),
      namespaces: namespaces.map(namespace => ({ name: namespace, value: namespace }))
    } as configurations;
  } catch (error) {}
};

export default async () => {
  const { namespaces, services } = await loadConfiguration();

  inquirer.registerPrompt('table', inquirerTablePrompt);

  inquirer
    .prompt([
      {
        default: 'qa',
        type: 'table',
        name: 'namespaces',
        message: 'Select services and namespaces',
        columns: namespaces,
        rows: services
      }
    ])
    .then(async answers => {
      const { stderr } = await exec(`mkdir -p ${logPath}`);
      if (stderr) {
        console.error('error ocurred while creating logs folder', stderr);
      }

      (answers.namespaces as string[]).forEach((namespace, index) => {
        if (namespace) {
          const service = services[index];
          exec(`ps -ef | grep "kubectl port-forward" | grep "${service}" | awk '{print "kill "$2}' | bash`);
          exec(
            `kubectl port-forward -n ${namespace} svc/${service.name} ${service.port} > ${logPath}/${service.name}.log &`
          );
          console.log(`forwarding ${service.name} to ${namespace}`);
        }
      });
      process.exit(0);
    });
};
