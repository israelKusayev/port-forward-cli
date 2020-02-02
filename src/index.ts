#!/usr/bin/env node

import yargs from 'yargs';
import editConfig from './scripts/editConfig';
import showTable from './scripts/tablePrompt';

const args = yargs.command('edit', 'Edit configurations').argv;
console.log(args);

if (args._.length === 0) showTable();
if (args._.includes('edit')) editConfig();

process.on('uncaughtException', error => {
  console.error(error);
});

process.on('unhandledRejection', error => {
  console.error(error);
});
