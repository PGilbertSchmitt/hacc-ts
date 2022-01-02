import { parse } from './src/parser/parser';
import { compile } from './src/compiler/compiler';
import { decompile, describeConstants } from './src/compiler/debug';

const main = () => {
  const input = `1 + 3 + 15`;

  try {
    const ast = parse(input);
    const output = compile(ast);

    console.log('Constants:');
    console.log(describeConstants(output.constants));
    console.log('');
    console.log('Bytecode:');
    console.log(decompile(output.instructions));
  } catch (e) {
    console.error(e);
  }
};

main();
