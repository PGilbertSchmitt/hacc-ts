import { parse } from './src/parser/parser';
import { compile } from './src/compiler/compiler';
import { VM } from './src/vm/vm';

const main = () => {
  const input = `1 + 3 * -15 / 5 - 4`;

  try {
    const ast = parse(input);
    const bytecode = compile(ast);
    // console.log(JSON.stringify(bytecode));
    const vm = new VM(bytecode);
    vm.run();

  } catch (e) {
    console.error(e);
  }
};

main();
