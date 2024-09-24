export function debounce(fn: (...args: any) => Promise<any>, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let firstCall = true;

    return function (...args: any): Promise<any> {
        if (firstCall) {
            firstCall = false;
            return fn(...args);
        }

        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        return new Promise((resolve, reject) => {
            timeoutId = setTimeout(async () => {
                try {
                    const result = await fn(...args);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            }, delay);
        });
    };
}
