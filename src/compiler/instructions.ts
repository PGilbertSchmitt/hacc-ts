import { OpCode, lookup } from './code';

export class Instructions {
  private bytes: Buffer;
  private length: number;

  constructor() {
    this.bytes = Buffer.alloc(64);
    this.length = 0;
  }

  push = (op: OpCode, operands: number[] = []): number => {
    return this.addToBytes(this.toBuffer(op, operands));
  };

  getBytes = (): Buffer => {
    return Buffer.from(this.bytes.slice(0, this.length));
  };

  private toBuffer = (op: OpCode, operands: number[]): Buffer => {
    const { operandWidths } = lookup(op);
    let instructionLength = 1;
    for (const w of operandWidths) { instructionLength += w; }

    const instructions = Buffer.alloc(instructionLength);
    instructions[0] = op;

    let offset = 1;
    operands.forEach((operand, i) => {
      const width = operandWidths[i];
      instructions.writeUIntBE(operand, offset, width);
      offset += width;
    });

    return instructions;
  };

  private addToBytes = (other: Buffer): number => {
    const newLength = this.length + other.length;
    while (this.bytes.length < newLength) {
      this.double();
    }
    other.copy(this.bytes, this.length);
    this.length += other.length;
    return this.length;
  };

  private double() {
    this.bytes = Buffer.concat([this.bytes], this.bytes.length * 2);
  };
}
