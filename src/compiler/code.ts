export enum OpCode {
  Constant = 0b0000_0001,
}

interface Definition {
  name: string,
  operandWidths: number[]
};

export const lookup = (op: OpCode): Definition => {
  switch (op) {
    case OpCode.Constant:
      return {
        name: 'Constant',
        operandWidths: [2]
      }
    default:
      throw new Error(`Unknown opcode '${op}'`);
  }
};
