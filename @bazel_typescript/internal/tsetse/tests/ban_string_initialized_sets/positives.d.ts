declare function setWithStringLiteral(): void;
declare function setWithStringVariable(s: string): void;
declare function setWithStringUnionType(s: string | string[]): void;
declare function setWithStringExpression(fn: () => string): void;
declare function setWithStringExpression2(): void;
declare type TypeA = string | Set<string>;
declare type TypeB = TypeA | (Iterable<string> & IterableIterator<string>);
declare function setWithComplexInitializationType(s: TypeB): void;
declare function setWithUnionStringType(s: string & {
    toString(): string;
}): void;
declare function setWithLocalAlias(): void;
declare function setWithMultipleAliases(): void;
declare function setUsingSetConstructorType(ctor: SetConstructor): void;
declare type MySet = SetConstructor;
declare function setUsingAliasedSetConstructor(ctor: MySet): void;
