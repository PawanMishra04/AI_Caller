import fs from 'fs';
import path from 'path';
import JavaScriptObfuscator from 'javascript-obfuscator';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Support for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const jsDir = path.join(__dirname, './build/static/js');

fs.readdir(jsDir, (err, files) => {
  files.forEach(file => {
    if (file.endsWith('.js')) {
      const filePath = path.join(jsDir, file);
      const code = fs.readFileSync(filePath, 'utf8');
      const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: true,
      }).getObfuscatedCode();
      fs.writeFileSync(filePath, obfuscatedCode);
    }
  });
});
