import childProcess from 'child_process';
import util from 'util';
import inquirer from 'inquirer';
import inquirerTablePrompt from 'inquirer-table-prompt';
import { logPath, loadConfiguration } from '../config';

const exec = util.promisify(childProcess.exec);

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
