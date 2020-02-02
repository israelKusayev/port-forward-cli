import inquirer from 'inquirer';

const questions = [
  {
    type: 'editor',
    name: 'bio',
    message: 'Please write a short bio of at least 3 lines.',
    validate: function(text: string) {
      if (text.split('\n').length < 3) {
        return 'Must be at least 3 lines.';
      }

      return true;
    }
  }
];
export default () => {
  inquirer.prompt(questions).then(answers => {
    console.log(JSON.stringify(answers, null, '  '));
  });
};
