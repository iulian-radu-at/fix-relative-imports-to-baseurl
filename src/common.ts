import * as path from 'path';
import * as vscode from 'vscode';
import { log } from './log';

export const DELIM_MSG =
  '------------------------------------------------------------------------';

export function showInformationMessage(msg: string) {
  vscode.window.showInformationMessage(msg);
}

const REGEX_IMPORT = /(import\s+[^;]+?\s+from\s*["'])((?:\.|\.\.)[\/\\][^"']+)(["'])/gs;
export function getFixedImports(
  filePath: string,
  code: string,
  baseUrlWithTrailingSlash: string
): { countFixes: number; newCode: string } {
  const dirPath = path.dirname(filePath);

  let countFixes = 0;
  const newCode = code.replace(
    REGEX_IMPORT,
    (match, importPrefixAndOpenQuote, relativePath, closeQuote) => {
      countFixes++;

      const filePath = path.resolve(dirPath, relativePath);
      const newRelativePath = filePath
        .substr(baseUrlWithTrailingSlash.length)
        .replace(/\\/g, '/');
      const newImport = `${importPrefixAndOpenQuote}${newRelativePath}${closeQuote}`;
      log(`Replaced <${match}> with <${newImport}>`);
      return newImport;
    }
  );
  return { countFixes, newCode };
}
