import inquirer, { QuestionCollection } from 'inquirer';
import { addService } from '../config';

const questions: QuestionCollection[] = [
  {
    type: 'input',
    name: 'name',
    message: 'Please enter service name: ',
    validate: (value: string) => (!value ? 'Service name is required' : true)
  },
  {
    type: 'input',
    name: 'port',
    message: 'Please enter service port: ',
    validate: (value: string) => (!value ? 'Port is required' : isNaN(+value) ? 'Port must be a number' : true)
  }
];

export default async () => {
  inquirer.prompt(questions).then(async ({ name, port }) => {
    addService(name, port);
  });
};
