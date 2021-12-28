export enum Keyword {
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  NULL = 'NULL',
}

export enum OpType {
  ASSIGN = 'ASSIGN',
  PLUS = 'PLUS',
  DASH = 'DASH',
  STAR = 'STAR',
  SLASH = 'SLASH',
  DBL_STAR = 'DBL_STAR',
  DBL_PIPE = 'DBL_PIPE',
  DBL_AMP = 'DBL_AMP',
  EQ = 'EQ',
  NEQ = 'NEQ',
  GTEQ = 'GTEQ',
  GT = 'GT',
  LTEQ = 'LTEQ',
  LT = 'LT',
  AMP = 'AMP',
  PIPE = 'PIPE',
  CARET = 'CARET',
  DBL_DOT = 'DBL_DOT',
  TPL_DOT = 'TPL_DOT',
  BANG = 'BANG',
}

export enum NodeType {
  KEYWORD = 'KEYWORD',

  IDENT = 'IDENT',
  NUMBER = 'NUMBER',
  STRING = 'STRING',

  INFIX = 'INFIX',
  UNARY = 'UNARY',
  RETURN = 'RETURN',

  BLOCK = 'BLOCK',
  FUNCTION = 'FUNCTION',
  ARRAY = 'ARRAY',
  MAP = 'MAP',
  SET = 'SET',
}

export type Node = KeywordNode
                 | IdentNode
                 | NumberNode
                 | StringNode
                 | InfixNode
                 | UnaryNode
                 | ReturnNode
                 | BlockNode
                 | FunctionNode
                 | ArrayNode
                 | MapNode
                 | SetNode;

export type KeywordNode = {
  type: NodeType.KEYWORD;
  name: Keyword;
}

export type IdentNode = {
  type: NodeType.IDENT;
  name: string;
}

export type NumberNode = {
  type: NodeType.NUMBER;
  value: number;
}

export type StringNode = {
  type: NodeType.STRING;
  value: string;
}

export type InfixNode = {
  type: NodeType.INFIX;
  left: Node;
  op: OpType;
  right: Node;
}

export type UnaryNode = {
  type: NodeType.UNARY;
  op: OpType;
  right: Node;
}

export type ReturnNode = {
  type: NodeType.RETURN;
  node: Node;
};

export type BlockNode = {
  type: NodeType.BLOCK;
  nodes: Node[];
};

export type FunctionNode = {
  type: NodeType.FUNCTION;
  params: IdentNode[];
  body: Node;
};

export type ArrayNode = {
  type: NodeType.ARRAY,
  nodes: Node[]
};

export type KeyValuePair = {
  key: Node;
  value: Node;
}

export type MapNode = {
  type: NodeType.MAP
  pairs: KeyValuePair[]
};

export type SetNode = {
  type: NodeType.SET,
  nodes: Node[]
};

// The grammars for these are arrays of tuples where some of the collected parsed values
// are thrown away, like whitespace or semicolons
export type ExpressionTail = [unknown, OpType, unknown, Node];
export type LineTail = [unknown, unknown, unknown, Node];
export type IdentListTail = [unknown, unknown, unknown, IdentNode];
export type BlockTail = [unknown, Node[]];
