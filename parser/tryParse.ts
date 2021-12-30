import { parse } from './parser';
import { readFileSync, writeFileSync } from 'fs';

const rubric = readFileSync(__dirname + '/../rubric.hacc').toString();

try {
  const ast = JSON.stringify(parse(rubric));
  writeFileSync(__dirname + '/../ast.json', ast);
  console.log('Done!');
} catch (e) {
  console.log(e);
  const { found, location: { start: { line, column } } } = (e as any);
  console.error(`Unexpected '${found}' on line ${line}:${column}`);
}
