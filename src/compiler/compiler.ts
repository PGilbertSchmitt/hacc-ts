import { Node, BlockNode, NodeType, OpType } from '../parser/ast';
import {
  HaccObject,
  newNumber,
  newString,
} from './object';
import { Instructions } from './instructions';
import {
  OpCode
} from './code';

export interface Bytecode {
  instructions: Instructions;
  constants: HaccObject[];
}

const addConstant = (obj: HaccObject, bytecode: Bytecode): number => {
  bytecode.constants.push(obj);
  return bytecode.constants.length - 1;
};

const infixOpToCode = (op: OpType): OpCode => {
  switch (op) {
    case OpType.PLUS:
      return OpCode.ADD;  
    case OpType.DASH:
      return OpCode.SUBTRACT;
    case OpType.STAR:
      return OpCode.MULTIPLY;
    case OpType.SLASH:
      return OpCode.DIVIDE;
    default:
      throw new Error(`Cannot use operator '${op}' in infix expression`);
  }
}

const _compile = (node: Node, bytecode: Bytecode) => {
  switch (node.type) {
    case NodeType.BLOCK:
      node.nodes.forEach(subNode => _compile(subNode, bytecode));
      break;  

    case NodeType.INFIX:
      _compile(node.left, bytecode);
      _compile(node.right, bytecode);
      bytecode.instructions.push(infixOpToCode(node.op));
      break;

    case NodeType.NUMBER: {
      const index = addConstant(newNumber(node.value), bytecode);
      bytecode.instructions.push(OpCode.CONSTANT, [index]);
      break;
    }

    case NodeType.STRING: {
      const index = addConstant(newString(node.value), bytecode);
      bytecode.instructions.push(OpCode.CONSTANT, [index]);
      break;
    }

    default:
      throw new Error(`Not sure how to process node of type '${node.type}'`);
  }
};

export const compile = (ast: BlockNode): Bytecode => {
  const bytecode: Bytecode = {
    instructions: new Instructions(),
    constants: []
  };
  _compile(ast, bytecode);
  return bytecode;
};
