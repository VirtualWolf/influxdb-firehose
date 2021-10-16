export function log(message: string, level: 'INFO' | 'ERROR' | 'DEBUG' = 'INFO') {
    const time = new Date().toISOString();

    if (process.env.DEBUG && level === 'DEBUG') {
        console.log(`${time} [${level}]`, message);
    } else if (level !== 'DEBUG') {
        console.log(`${time} [${level}]`, message);
    }
}
