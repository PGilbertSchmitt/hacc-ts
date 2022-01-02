export enum OpCode {
  // Constants
  CONSTANT = 0x01,

  // Math
  ADD      = 0x10,
  SUBTRACT = 0x11,
  DIVIDE   = 0x12,
  MULTIPLY = 0x13,
}

interface Definition {
  name: string,
  operandWidths: number[]
};

export const lookup = (op: OpCode): Definition => {
  switch (op) {
    case OpCode.CONSTANT:
      return {
        name: 'Constant',
        operandWidths: [2]
      }
    case OpCode.ADD:
      return {
        name: 'Add',
        operandWidths: []
      }
    case OpCode.SUBTRACT:
      return {
        name: 'Subtract',
        operandWidths: []
      }
    case OpCode.MULTIPLY:
      return {
        name: 'Multiply',
        operandWidths: []
      }
    case OpCode.DIVIDE:
      return {
        name: 'Divide',
        operandWidths: []
      }
    default:
      throw new Error(`Unknown opcode '${op}'`);
  }
};
