/**
 * @fileoverview Examples for the mutable exports rule.
 * We expect every 'bad' to be an error, and every 'ok' to pass.
 * These are checked as expected diagnostics in the BUILD file.
 */
export declare let bad1: number;
export declare var bad2: number;
export declare var bad3: number, bad4: number;
declare var bad5: number;
export { bad5 };
declare let bad6: number;
export { bad6 };
export { bad6 as bad6alias };
declare var bad7: number;
export { bad7 as default };
export declare let bad8: number;
export declare let bad9: unknown;
export declare const ok3 = 3;
declare const ok5 = 3;
export { ok5 };
export declare type ok6 = string;
export declare function ok7(): void;
export declare class ok8 {
}
