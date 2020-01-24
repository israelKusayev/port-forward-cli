#!/usr/bin/env node

import { spawn } from 'child_process';
import { configPath } from './config';

const editor = process.env.EDITOR || 'vim';

spawn(editor, [configPath], { stdio: 'inherit' });
