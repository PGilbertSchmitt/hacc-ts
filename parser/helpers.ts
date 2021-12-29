import {
  Keyword,
  OpType,
  NodeType,
  
  Node,

  KeywordNode,
  IdentNode,
  NumberNode,
  StringNode,
  InfixNode,
  UnaryNode,
  ReturnNode,
  BlockNode,
  FunctionNode, 
  ArrayNode,
  SetNode,
  KeyValuePair,
  MapNode,
  GroupNode,
  
  ExpressionTail,
  NodeTail,
  IdentListTail,
  KeyValuePairTail,
  BlockTail,
} from './ast';

interface LocationPart {
  offset: number;
  line: number;
  column: number;
}

interface Location {
  start: LocationPart;
  end: LocationPart;
}

const toKeyword = (value: string): Keyword => {
  switch (value) {
    case 'true': return Keyword.TRUE;
    case 'false': return Keyword.FALSE;
    case 'null': return Keyword.NULL;
    default: throw new Error(`Unexpected keyword '${value}'`);
  }
};

export const newKeyword = (value: string): KeywordNode => ({
  type: NodeType.KEYWORD,
  name: toKeyword(value)
});

export const parseOp = (opString: string): OpType => {
  switch (opString) {
    case '=':
      return OpType.ASSIGN;
    case '+':
      return OpType.PLUS;
    case '-':
      return OpType.DASH;
    case '*':
      return OpType.STAR;
    case '/':
      return OpType.SLASH;
    case '**':
      return OpType.DBL_STAR;
    case '||':
      return OpType.DBL_PIPE;
    case '&&':
      return OpType.DBL_AMP;
    case '==':
      return OpType.EQ;
    case '!=':
      return OpType.NEQ;
    case '>=':
      return OpType.GTEQ;
    case '>':
      return OpType.GT;
    case '<=':
      return OpType.LTEQ;
    case '<':
      return OpType.LT;
    case '&':
      return OpType.AMP;
    case '|':
      return OpType.PIPE;
    case '^':
      return OpType.CARET;
    case '..':
      return OpType.DBL_DOT;
    case '...':
      return OpType.TPL_DOT;
    case '!':
      return OpType.BANG;
    default:
      throw new Error(`No such operator '${opString}'`);
  }
};

export const parseNumber = (numberString: string, _location: Location): NumberNode => ({
  type: NodeType.NUMBER,
  value: parseFloat(numberString),
});

export const newString = (value: string, _location: Location): StringNode => ({
  type: NodeType.STRING,
  value,
});

export const newUnary = (op: OpType, right: Node, _location: Location): UnaryNode => ({
  type: NodeType.UNARY,
  op,
  right,
});

const wrapInfix = (left: Node, tail: ExpressionTail): InfixNode => {
  const [ _1, op, _2, right] = tail;
  return {
    type: NodeType.INFIX,
    left,
    op,
    right,
  }
};

export const newInfix = (
  head: Node,
  tail: ExpressionTail[],
  location: Location
): Node => {
  if (tail.length === 0) {
    return head;
  }
  
  const [ next, ...rest ] = tail;
  const infix = wrapInfix(head, next);
  
  return newInfix(infix, rest, location);
};

export const newIdent = (name: string, _location: Location): IdentNode => ({
  type: NodeType.IDENT,
  name,
});

export const newReturn = (node: Node, _location: Location): ReturnNode => ({
  type: NodeType.RETURN,
  node,
});

export const newNodeList = (head: Node, tail: NodeTail[] = []): Node[] => {
  return [head, ...tail.map(tailNode => tailNode[3])];
};

export const newBlock = (top: Node[], body: BlockTail[], _location: Location): BlockNode => ({
  type: NodeType.BLOCK,
  nodes: body.reduce((nodes, [_1, _2, _3, newNodes, _5]) => {
    return nodes.concat(...newNodes);
  }, top)
});

export const newEmptyBlock = (_location: Location): BlockNode => ({
  type: NodeType.BLOCK,
  nodes: []
});

export const newIdentList = (
  head: IdentNode,
  tail: IdentListTail[],
  _location: Location
): IdentNode[] => ([ head, ...tail.map(tailNode => tailNode[3]) ]);

export const newFuncLiteral = (
  params: IdentNode[] | null,
  body: Node,
  _location: Location
): FunctionNode => ({
  type: NodeType.FUNCTION,
  params: params === null ? [] : params,
  body
});

export const newArrayLiteral = (
  nodes: Node[] | null,
  _location: Location  
): ArrayNode => ({
  type: NodeType.ARRAY,
  nodes: nodes === null ? [] : nodes
});

export const newSetLiteral = (
  nodes: Node[] | null,
  _location: Location
): SetNode => ({
  type: NodeType.SET,
  nodes: nodes === null ? [] : nodes
});

export const newKeyValuePair = (
  key: Node,
  value: Node,
  _location: Location
): KeyValuePair => ({ key, value });

export const newKeyValuePairList = (
  head: KeyValuePair,
  tail: KeyValuePairTail[]
): KeyValuePair[] => ([ head, ...tail.map(tailNode => tailNode[3]) ]);

export const newMapLiteral = (
  pairs: KeyValuePair[] | null
): MapNode => ({
  type: NodeType.MAP,
  pairs: pairs === null ? [] : pairs
});

export const newGroup = (
  block: BlockNode,
  _location: Location
): GroupNode => ({
  type: NodeType.GROUP,
  nodes: block.nodes
});
