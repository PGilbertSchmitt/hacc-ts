{
const {
  parseOp,
  parseNumber,
  newKeyword,
  newString,
  newUnary,
  newInfix,
  newIdent,
  newReturn,
  newNodeList,
  newBlock,
  newEmptyBlock,
  newIdentList,
  newExprList,
  newFuncLiteral,
  newArrayLiteral,
} = require('./helpers.ts');
}

// START HERE

Program
  = _ block:BlockBody _bs_ EOF { return block }

BlockBody
  = top:BlockLine body:(_bs_ BlockLine)* {
    return newBlock(top, body, location())
  }

BlockLine
  = _ head:Return {
    return head;
  }
  / _ head:Expr tail:(__ ';' __ Expr)* {
    return newNodeList(head, tail);
  }

Expr = Assign

Return
  = RETURN __ expr:Expr {
    return newReturn(expr, location());
  }

// Terminals

ESCAPABLE
  = ["\\ntrbf]

UNDSC
  = "_"

ALPHA
  = [a-z]i

DECIMAL
  = [0-9]

DECIMAL_NON_ZERO
  = [1-9]

HEX
  = [0-9a-f]i

BINARY
  = [01]

ASSIGN = '='
PLUS = '+'
DASH = '-'
SLASH = '/'
STAR = '*'
DBL_STAR = '**'
MODULO = '%'
PIPE = '|'
DBL_PIPE = '||'
AMP = '&'
DBL_AMP = '&&'
CARET = '^'
EQ = '=='
NEQ = '!='
GT = '>'
LT = '<'
GTEQ = '>='
LTEQ = '<='
DOT = '.'
DBL_DOT = '..'
TPL_DOT = '...'
BANG = '!'
RETURN = '<-'

// Whitespace

_ "whitespace"
  = [ \t\n\r]*

__ "nonbreaking_space"
  = [ \t]*

_bs_ "breaking_space"
  = [\n\r]*

_nb_ "nonbreaking_char"
  = [^\n\r]*

EOF = !.

// Keywords

Keywords
  = ( "true"
    / "false"
    / "null" ) { return newKeyword(text()) }

// Operation Groups

AssignOp
  = op:(ASSIGN) { return parseOp(op); }
AddOp
  = op:(PLUS / DASH) { return parseOp(op); }
MultOp
  = op:(STAR / SLASH) { return parseOp(op); }
ExpOp
  = op:(DBL_STAR) { return parseOp(op); }
OrOp
  = op:(DBL_PIPE) { return parseOp(op); }
AndOp
  = op:(DBL_AMP) { return parseOp(op); }
EqOp
  = op:(EQ / NEQ) { return parseOp(op); }
CompOp
  = op:(GTEQ / GT / LTEQ / LT) { return parseOp(op); }
LogicOp
  = op:(AMP / PIPE / CARET) { return parseOp(op); }
RangeOp
  = op:(DBL_DOT / TPL_DOT) { return parseOp(op); }
UnaryOp
  = op:(BANG / DASH) { return parseOp(op); }

// Base Literals

Integer
  = '0'
  / (DECIMAL_NON_ZERO DECIMAL*)

Fraction
  = DOT DECIMAL+

Number
  = number:(DASH? Integer Fraction?) {
    return parseNumber(text(), location());
  }

Ident
  = (ALPHA / UNDSC) (ALPHA / UNDSC / DECIMAL)* {
    return newIdent(text(), location());
  }

String
  = '"' ( ![\x00-\x1f"\\] . / '\\' ESCAPABLE )* '"' {
    return newString(text(), location());
  }

Primary
  = Number
  / Keywords
  / Ident
  / String
  / FuncLiteral
  / ArrayLiteral

// Compound literals

IdentList
  = head:Ident tail:(_ ',' _ Ident)* {
    return newIdentList(head, tail, location());
  }

ExprList
  = head:Expr tail:(_ ',' _ Expr)* {
    return newNodeList(head, tail, location());
  }

ScopedBlock
  = '{' _ body:BlockBody _ '}' {
    return body
  }
  / '{' _ '}' {
    return newEmptyBlock(location());
  }

// KeyTypes
//   = Number
//   / Ident
//   / String
//   / ArrayLiteral
//   / HashLiteral
//   / FuncLiteral
//   / GroupExpression

// KeyValPair
//   = key:KeyTypes _ ':' _ val:Expr {
//     return newKeyValPair(key, val);
//   }

FuncLiteral
  = '(' _ params:(IdentList)? _ ')' __ "=>" _ body:(
    ScopedBlock / Expr
  ) {
    return newFuncLiteral(params, body, location());
  }

ArrayLiteral
  = '[' _ list:ExprList _ ']' {
    return newArrayLiteral(list, location());
  }

// Expressions

UnaryExpression
  = op: UnaryOp node:Unary {
    return newUnary(op, node)
  }

PostFix
  = target:Primary {
    return target;
  }

Unary
  = UnaryExpression
  / PostFix

Exponentiation
  = head:Unary tail:(__ ExpOp __ Unary)* {
    return newInfix(head, tail, location());
  }

Multiplication
  = head:Exponentiation tail:(__ MultOp __ Exponentiation)* {
    return newInfix(head, tail, location());
  }

Addition
  = head:Multiplication tail:(__ AddOp __ Multiplication)* {
    return newInfix(head, tail, location());
  }

Range
  = head:Addition tail:(__ RangeOp __ Addition)* {
    return newInfix(head, tail, location());
  }

Logic
  = head:Range tail:(__ LogicOp __ Range)* {
    return newInfix(head, tail, location());
  }

Comparison
  = head:Logic tail:(__ CompOp __ Logic)* {
    return newInfix(head, tail, location());
  }

Equality
  = head:Comparison tail:(__ EqOp __ Comparison)* {
    return newInfix(head, tail, location());
  }

And
  = head:Equality tail:(__ AndOp __ Equality)* {
    return newInfix(head, tail, location());
  }

Or
  = head:And tail:(__ OrOp __ And)* {
    return newInfix(head, tail, location());
  }

Assign
  = head:Or tail:(__ AssignOp __ Or)* {
    return newInfix(head, tail, location());
  }
