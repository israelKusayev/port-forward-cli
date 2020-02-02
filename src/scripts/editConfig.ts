import { spawn } from 'child_process';
import { configPath } from '../config';

export default () => {
  const editor = process.env.EDITOR || 'vim';
  spawn(editor, [configPath], { stdio: 'inherit' });
};
