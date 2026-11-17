export type Either<L, R> = { kind: 'left'; value: L } | { kind: 'right'; value: R }

export const left = <L, R>(value: L): Either<L, R> => ({ kind: 'left', value })
export const right = <L, R>(value: R): Either<L, R> => ({ kind: 'right', value })
