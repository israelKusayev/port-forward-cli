import childProcess from 'child_process';
import util from 'util';
import inquirer from 'inquirer';
import inquirerTablePrompt from 'inquirer-table-prompt';

const exec = util.promisify(childProcess.exec);

const logPath = '/tmp/log/port-forward';
const services = [
  {
    name: 'vision-synapse',
    value: 0,
    port: 9041
  },
  {
    name: 'vision-directory',
    value: 1,
    port: 9031
  },
  {
    name: 'vision-orchestrator',
    value: 2,
    port: 8092
  }
];

const namespaces = [
  {
    name: 'qa',
    value: 'qa'
  },
  {
    name: 'stage',
    value: 'stage'
  },
  {
    name: 'sales',
    value: 'sales'
  }
];

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
        exec(
          `kubectl port-forward -n ${namespace} svc/${service.name} ${service.port} > ${logPath}/${service.name}.log &`
        );
        console.log(`forwarding ${service.name} to ${namespace}`);
      }
    });
    process.exit(0);
  });

process.on('uncaughtException', error => {
  console.error(error);
});

process.on('unhandledRejection', error => {
  console.error(error);
});
//   NAMESPACE=$1
//   [[ -z $NAMESPACE ]] && echo "Please provide namespace" && exit 1
//   declare -A SERVICES=(["vision-orchestrator"]="8092" ["vision-directory"]="9031" ["vision-synapse"]="9041" ["users-management"]="4001")
//   for service in ${!SERVICES[@]}; do
//     ps -ef | grep "kubectl port-forward" | grep "${service}" | awk '{print "kill "$2}' | bash
//     kubectl port-forward -n ${NAMESPACE} svc/${service} ${SERVICES[$service]} > port-forward/${service}.log &
//   done
