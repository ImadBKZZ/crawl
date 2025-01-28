// Asynchronous timeout function. Returns a Promise, which throws an Error
// with the given |message| if |ms| milliseconds passes. Also returns a
// timeout id, can be used to cancel the timeout.
export function createAsyncTimeout(message, ms) {
    let timeoutId;
    const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error(`${message} - ${ms}ms`));
        }, ms);
    });
    // @ts-ignore
    return [timeout, timeoutId];
}
// Asynchronous sleep function. Returns a Promise that resolves after |ms|
// milliseconds.
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=timeout.js.map