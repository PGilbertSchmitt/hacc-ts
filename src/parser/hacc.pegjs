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
  newIdentList,
  newExprList,
  newKeyValuePair,
  newKeyValuePairList,
  newFuncLiteral,
  newArrayLiteral,
  newSetLiteral,
  newMapLiteral,
  newGroup,
  newMember,
  newCall,
  newIndex,
  newPostfix,
  newCase,
  newCaseBlock,
  newIf,
  newSwitch,
} = require('./helpers.ts');
}

// START HERE

Program
  = _ block:BlockBody _ EOF { return block }

BlockBody
  = top:BlockLine body:((__ _bs_)* __ BlockLine)* {
    return newBlock(top, body, location())
  }

BlockLine
  = head:Return tail:(__ ';' __ Return)* {
    return newNodeList(head, tail);
  }

// Whitespace

_ "whitespace"
  = ([ \t\n\r] / COMMENT)*

__ "nonbreaking_space"
  = [ \t]*

_bs_ "breaking_space"
  = [\n\r] / COMMENT

_nb_ "nonbreaking_char"
  = [^\n\r]*

EOF = !.

// Terminals

ASSIGN     = '='
PLUS       = '+'
DASH       = '-'
SLASH      = '/'
DBL_SLASH  = '//'
STAR       = '*'
DBL_STAR   = '**'
MODULO     = '%'
PIPE       = '|'
DBL_PIPE   = '||'
AMP        = '&'
DBL_AMP    = '&&'
CARET      = '^'
EQ         = '=='
NEQ        = '!='
GT         = '>'
LT         = '<'
GTEQ       = '>='
LTEQ       = '<='
DOT        = '.'
DBL_DOT    = '..'
TPL_DOT    = '...'
BANG       = '!'
RETURN     = '<-'
UNDSC      = "_"
SLASH_STAR = "/*"
STAR_SLASH = "*/"

COMMENT
  = DBL_SLASH _nb_ [\n\r]

ESCAPABLE
  = ["\\ntrbf]

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
  = op:(STAR / SLASH / MODULO) { return parseOp(op); }
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
  = op:(TPL_DOT / DBL_DOT) { return parseOp(op); }
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
  / IfExpr
  / SwitchExpr
  / Keywords
  / Ident
  / String
  / FuncLiteral
  / ArrayLiteral
  / SetLiteral
  / MapLiteral
  / WrappedBlock // This has to be the lowest priority primary

// Compound literals

WrappedBlock
  = '(' _ body:BlockBody _ ')' {
    return body;
  }

IdentList
  = head:Ident tail:(_ ',' _ Ident)* {
    return newIdentList(head, tail, location());
  }

ExprList
  = head:Expr tail:(_ ',' _ Expr)* {
    return newNodeList(head, tail, location());
  }

KeyTypes
  = Number
  / Keywords
  / Ident
  / String
  / ArrayLiteral
  / MapLiteral
  / FuncLiteral
  / WrappedBlock

KeyValPair
  = key:KeyTypes _ ':' _ val:Expr {
    return newKeyValuePair(key, val, location());
  }

KeyValPairList
  = head:KeyValPair tail:(_ ',' _ KeyValPair)* {
    return newKeyValuePairList(head, tail, location());
  }

FuncLiteral
  = '(' _ params:IdentList? _ ')' __ "=>" _ body:Expr {
    return newFuncLiteral(params, body, location());
  }

ArrayLiteral
  = '[' _ list:ExprList? _ ']' {
    return newArrayLiteral(list, location());
  }

SetLiteral
  = '<#' _ list:ExprList? _ '#>' {
    return newSetLiteral(list, location());
  }

MapLiteral
  = '{' _ pairs:KeyValPairList? _ '}' {
    return newMapLiteral(pairs, location());
  }

// Expressions

Return // Lowest priority, can't be contained within other expressions unless within a block
  = ret:RETURN? __ expr:Expr {
    return ret === null ? expr : newReturn(expr, location());
  }

Expr = Assign

UnaryExpression
  = op: UnaryOp node:Unary {
    return newUnary(op, node)
  }

PostFix
  = target:Primary addendums:(Member / Call / Index)* {
    return newPostfix(target, addendums, location());
  }

Unary
  = UnaryExpression
  / PostFix

Exponentiation
  = head:Unary tail:(__ ExpOp _ Unary)* {
    return newInfix(head, tail, location());
  }

Multiplication
  = head:Exponentiation tail:(__ MultOp _ Exponentiation)* {
    return newInfix(head, tail, location());
  }

Addition
  = head:Multiplication tail:(__ AddOp _ Multiplication)* {
    return newInfix(head, tail, location());
  }

Range
  = head:Addition tail:(__ RangeOp _ Addition)* {
    return newInfix(head, tail, location());
  }

Logic
  = head:Range tail:(__ LogicOp _ Range)* {
    return newInfix(head, tail, location());
  }

Comparison
  = head:Logic tail:(__ CompOp _ Logic)* {
    return newInfix(head, tail, location());
  }

Equality
  = head:Comparison tail:(__ EqOp _ Comparison)* {
    return newInfix(head, tail, location());
  }

And
  = head:Equality tail:(__ AndOp _ Equality)* {
    return newInfix(head, tail, location());
  }

Or
  = head:And tail:(__ OrOp _ And)* {
    return newInfix(head, tail, location());
  }

Assign
  = head:Or tail:(__ AssignOp _ Or)* {
    return newInfix(head, tail, location());
  }

// Postfix Expressions

Member
  = _ '.' addendum:Ident {
    return newMember(addendum, location());
  }

Call
  = '(' _ list:ExprList? _ ')' {
    return newCall(list, location());
  }

Index
  = '[' _ expr:Expr _ ']' {
    return newIndex(expr, location());
  }

// Flow Control

Case
  = condition:KeyTypes ':' _ consequence:Return {
    return newCase(condition, consequence, location());
  }

CaseBlock
  = '{' _ head:Case tail:((__ (_bs_ / ';'))* __  Case)* _ '}' {
    return newCaseBlock(head, tail, location());
  }

IfExpr
  = "if" __ cases:CaseBlock {
    return newIf(cases, location());
  }

SwitchExpr
  = "switch" __ test:WrappedBlock _ cases:CaseBlock {
    return newSwitch(test, cases, location());
  }
