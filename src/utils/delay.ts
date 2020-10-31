export const delay = (ms: number) => new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), ms);
});