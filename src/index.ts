#!/usr/bin/env node

import yargs from 'yargs';
import editor from './scripts/editor';
import addService from './scripts/addService';
import editConfig from './scripts/editConfig';
import showTable from './scripts/tablePrompt';

const args = yargs.command('edit', 'Edit configurations').command('add', 'Add a service').argv;

if (args._.length === 0) showTable();
if (args._.includes('edit')) editConfig();
if (args._.includes('add')) addService();
if (args._.includes('editor')) editor();

process.on('uncaughtException', error => {
  console.error(error);
});

process.on('unhandledRejection', error => {
  console.error(error);
});
