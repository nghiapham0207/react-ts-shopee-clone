export interface SuccessResponse<Data> {
	message: string;
	data: Data;
}

export interface ErrorResponse<Data> {
	message: string;
	data?: Data;
}

export type NoUndefinedField<T> = {
	[P in keyof T]: Exclude<T[P], null | undefined>;
	// [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};
