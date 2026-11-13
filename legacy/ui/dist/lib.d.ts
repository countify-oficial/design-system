import type { Option, Trend } from "./types.js";
type Item = {
    id: string;
    disabled?: boolean;
};
export declare function selectAllState(items: Item[], selected: string[]): "none" | "some" | "all";
export declare function toggleAll(items: Item[], selected: string[]): string[];
export declare function toggleId(selected: string[], id: string): string[];
export declare const WEEKDAYS: readonly [readonly ["D", "domingo"], readonly ["S", "segunda"], readonly ["T", "terça"], readonly ["Q", "quarta"], readonly ["Q", "quinta"], readonly ["S", "sexta"], readonly ["S", "sábado"]];
export declare const dayKey: (d: Date) => number;
export declare const sameDay: (a?: Date | null, b?: Date | null) => boolean;
export declare const startOfMonth: (d: Date) => Date;
export declare const addMonths: (d: Date, n: number) => Date;
export declare function monthGrid(year: number, month: number): (Date | null)[][];
export type RangeRole = "start" | "end" | "in" | "single";
export declare function rangeRole(day: Date, start?: Date | null, end?: Date | null): RangeRole | null;
export type Range = {
    start: Date;
    end: Date | null;
};
export declare function nextRange({ start, end }: {
    start?: Date | null;
    end?: Date | null;
} | undefined, day: Date): Range;
export declare const monthLabel: (d: Date) => string;
export declare const dayLabel: (d: Date) => string;
export declare function formatTime(text: string): string;
export declare function selectSummary(options: Option[], value?: string | string[], multiple?: boolean): string;
export declare const clamp01: (v: unknown) => number;
export declare function pageLabel(page: number, pageSize: number, total: number): string;
export declare const TREND: Record<Trend, [string, string]>;
export declare function mix(a: string, b: string, t: number): string;
export declare function contrast(a: string, b: string): number;
export {};
