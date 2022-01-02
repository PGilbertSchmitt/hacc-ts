import { OpCode } from '../compiler/code';
import { Bytecode } from '../compiler/compiler';
import { HaccObject } from '../compiler/object';
import {
  add,
  subtract,
  multiply,
  divide,
} from './operations';

export class VM {
  private STACK_SIZE = 2048;

  private constants: HaccObject[];
  private instructions: Buffer;
  private stack: HaccObject[];
  private sp: number; // Stack Pointer

  constructor(bytecode: Bytecode) {
    this.constants = bytecode.constants;
    this.instructions = bytecode.instructions.getBytes();
    this.stack = new Array(2048);
    this.sp = 0;
  };

  run = () => {
    const ins = this.instructions;
    for (let ip = 0; ip < ins.length; ip++) {
      const op = ins[ip];
      console.log(`[${ip}] Op(${op.toString(16)})`);

      switch (op) {
        case OpCode.CONSTANT: {
          const constIndex = ins.readUInt16BE(ip+1);
          ip += 2;
          this.push(this.constants[constIndex]);
          break;
        }
        case OpCode.ADD: {
          const right = this.pop();
          const left = this.pop();
          this.push(add(left, right));
          break;
        }
        case OpCode.SUBTRACT: {
          const right = this.pop();
          const left = this.pop();
          this.push(subtract(left, right));
          break;
        }
        case OpCode.MULTIPLY: {
          const right = this.pop();
          const left = this.pop();
          this.push(multiply(left, right));
          break;
        }
        case OpCode.DIVIDE: {
          const right = this.pop();
          const left = this.pop();
          this.push(divide(left, right));
          break;
        }
        default:
          throw new Error(`Unknown op ${op}`);
      }
    }

    console.log(this.stack.slice(0,this.sp));

    return null;
  };

  stackTop = () => {
    if (this.sp === 0) {
      return null;
    }
    return this.stack[this.sp - 1];
  };

  private push = (object: HaccObject) => {
    if (this.sp > this.STACK_SIZE) {
      // Should also include the frame stack in error when implemented
      throw new Error('Stack overflow');
    }
    this.stack[this.sp++] = object;
  };

  private pop = () => {
    const object = this.stack[--this.sp];
    if (object === undefined) {
      throw new Error('Attempted to pop from emtpy stack');
    }
    return object;
  };
};
