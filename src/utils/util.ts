const [, , ...args] = process.argv;

export const isDevMode = (): boolean =>
    args.includes('-D') || args.includes('--dev');
