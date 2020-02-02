import fs from 'fs';
import util from 'util';
import { configExamplePath, configPath } from '../config';

const copyFile = util.promisify(fs.copyFile);

(async () => {
  try {
    await copyFile(configExamplePath, configPath);
    console.log(`config file was created in ${configPath} you can change it now`);
  } catch (error) {
    console.error('could not add configuration file', error);
  }
})();
