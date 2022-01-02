export enum ObjectType {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  NULL = 'NULL',
}

export type HaccObject = NumberObject
                       | StringObject
                       | BooleanObject
                       | NullObject;

export const inspect = (object: HaccObject): string => {
  switch (object.type) {
    case ObjectType.NUMBER:
      return object.value.toString();
    case ObjectType.STRING:
      return `"${object.value}"`;
    case ObjectType.BOOLEAN:
      return object.value ? 'TRUE' : 'FALSE';
    case ObjectType.NULL:
      return 'NULL';
  }
};

interface NumberObject {
  type: ObjectType.NUMBER;
  value: number;
}

interface StringObject {
  type: ObjectType.STRING;
  value: string;
}

interface BooleanObject {
  type: ObjectType.BOOLEAN;
  value: boolean;
}

interface NullObject {
  type: ObjectType.NULL;
}

export const newNumber = (value: number): NumberObject => ({
  type: ObjectType.NUMBER,
  value,
});

export const newString = (value: string): StringObject => ({
  type: ObjectType.STRING,
  value,
});

export const newBoolean = (value: boolean): BooleanObject => ({
  type: ObjectType.BOOLEAN,
  value,
});

export const newNull = (): NullObject => ({ type: ObjectType.NULL });
