declare function emptySet(): void;
declare function noConstructorArgs(): void;
declare function nonStringSet(): void;
declare function setOfStrings(): void;
declare function setOfChars(): void;
declare function explicitlyAllowString(): void;
declare function justAKeyCalledSet(obj: {
    Set: {
        new (s: string): any;
    };
}): void;
declare function destructuredConstructorCalledSet(obj: {
    Set: {
        new (s: string): any;
    };
}): void;
declare function locallyDeclaredSet(): void;
