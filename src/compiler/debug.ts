import { lookup } from './code';
import { Instructions } from './instructions';
import { HaccObject, ObjectType } from './object';

export const describeConstants = (constants: HaccObject[]): string => {
  const objectOutput: string[] = [];

  constants.forEach((c, i) => {
    switch (c.type) {
      case ObjectType.NUMBER:
      case ObjectType.STRING:
        objectOutput.push(`${i}: ${c.type}(${c.value})`);
    }
  });

  return objectOutput.join('\n');
};

export const decompile = (instructions: Instructions): string => {
  const bytes = instructions.getBytes();
  let pointer = 0;

  const decompiledOutput: string[] = [];

  while (pointer < bytes.length) {
    const instruction = bytes[pointer];
    const { name, operandWidths } = lookup(instruction);
    const line = [name];
    let offset = pointer + 1;
    for (const width of operandWidths) {
      const value = bytes.readUInt16BE(offset);
      offset += width;
      line.push(value.toString());
    }

    decompiledOutput.push(line.join(' '));
    pointer = offset;
  }

  return decompiledOutput.join('\n');
};
