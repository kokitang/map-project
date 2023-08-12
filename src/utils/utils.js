// Debounce function
let debounceTimers = {};

function debounce(func, wait, key = 'default') {
    return async function(...args) {
        if (debounceTimers[key]) clearTimeout(debounceTimers[key]);
        return new Promise((resolve, reject) => {
            debounceTimers[key] = setTimeout(async () => {
                try {
                    const result = await func(...args);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            }, wait);
        });
    };
}

// Throttle function
let throttleTimer;
let lastExec = 0;

function throttle(func, wait, override = false) {
    return function(...args) {
        const context = this;
        const now = Date.now();
        const elapsed = now - lastExec;

        const performFunction = () => {
            lastExec = now;
            func.apply(context, args);
        }

        if (override) {
            performFunction();
            override = false; // Reset override after executing
        } else if (!throttleTimer && elapsed > wait) {
            performFunction();
        }

        clearTimeout(throttleTimer);
        throttleTimer = setTimeout(() => {
            if (elapsed < wait) {
                performFunction();
            }
            throttleTimer = null;
        }, wait - elapsed);
    };
}

export { debounce, throttle };
