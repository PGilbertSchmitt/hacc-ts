import {
  ObjectType,
  HaccObject,
  NumberObject,
  newNumber,
  newString,
  StringObject,
} from "../compiler/object";

const bothNumbers = (left: HaccObject, right: HaccObject): boolean => {
  return left.type === ObjectType.NUMBER && right.type === ObjectType.NUMBER;
};

const bothStrings = (left: HaccObject, right: HaccObject): boolean => {
  return left.type === ObjectType.STRING && right.type === ObjectType.STRING;
};

export const add = (left: HaccObject, right: HaccObject): HaccObject => {
  if (bothNumbers(left, right)) {
    return newNumber((left as NumberObject).value + (right as NumberObject).value);
  }

  if (bothStrings(left, right)) {
    return newString((left as StringObject).value + (right as NumberObject).value);
  }

  throw new Error(`Cannot perform '+' operation between ${left.type} && ${right.type}`);
};

export const subtract = (left: HaccObject, right: HaccObject): HaccObject => {
  if (bothNumbers(left, right)) {
    return newNumber((left as NumberObject).value - (right as NumberObject).value);
  }

  throw new Error(`Cannot perform '-' operation between ${left.type} && ${right.type}`);
};

export const multiply = (left: HaccObject, right: HaccObject): HaccObject => {
  if (bothNumbers(left, right)) {
    return newNumber((left as NumberObject).value * (right as NumberObject).value);
  }

  throw new Error(`Cannot perform '*' operation between ${left.type} && ${right.type}`);
};

export const divide = (left: HaccObject, right: HaccObject): HaccObject => {
  if (bothNumbers(left, right)) {
    if ((right as NumberObject).value === 0) {
      throw new Error('Divide by 0 error');
    }
    return newNumber((left as NumberObject).value / (right as NumberObject).value);
  }

  throw new Error(`Cannot perform '/' operation between ${left.type} && ${right.type}`);
};
