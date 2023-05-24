export type DecoratorCallback<T extends Array<any>> = (func: (...args: any[]) => any | void, decoratorParams: T) => (((...args: any[]) => any | void) | void);

export type OnlyDecorator = MethodDecorator;
export type DecoratorWithParams<T extends Array<any>> = (...args: T) => MethodDecorator;
export type FunctionDecorator<T extends Array<any>> = (func: any, ...args: T) => any;
export type FunctionDecoratorWithParams<T extends Array<any>> = (...args: T) => FunctionDecorator<T>;
export type DecoratorType<T extends Array<any>> = OnlyDecorator & DecoratorWithParams<T> & FunctionDecorator<T> & FunctionDecoratorWithParams<T>;

const ObjectUniqueIdSymbol = Symbol("objectUniqueId");

/**
 * There are several ways to use a decorator that's created using this function:
 * 1. 
 * ```
 * @myDecorator
 * myFunc() {
 * }
 * ```
 * 2.
 * ```
 * @myDecorator()
 * myFunc() {
 * }
 * ```
 * 3.
 * ```
 * @myDecorator(...args: any[]) // those args will be passed to the callback param as decoratorParams
 * myFunc() {
 * }
 * ```
 * 4.
 * ```
 * myDecorator(myFunc, ...args: any[]) OR myDecorator((...params: any[]) => myFunc(...params), ...args: any[]) // It can be used outside of a class / on callbacks
 * ```
 * 5.
 * ```
 * myDecorator(...args: any[])(myFunc) OR myDecorator(...args: any[])((...params: any[]) => myFunc(...params))
 * ```
 * @param callback A function that handles the decorator logic. It can return a function that will replace the function that it's being used on.
 * @returns A decorator
 */
export function decorator<T extends Array<any> = []>(callback: DecoratorCallback<Partial<T>>): DecoratorType<Partial<T>> {
    function _decorator(...args: any[]) {
        const funcs: { [key: string]: any } = {};

        if (typeof args[2]?.value === "function") {
            const func = args[2].value;
            args[2].value = function (this, ...args: any[]) {
                if (!this[ObjectUniqueIdSymbol]) {
                    this[ObjectUniqueIdSymbol] = Date.now();
                }

                const key = `${this[ObjectUniqueIdSymbol]}`;

                if (!funcs[key]) {
                    funcs[key] = callback((...args: any[]) => func.apply(this, args), [] as any);
                }

                return funcs[key](...args);
            }
        }
        else if (typeof args[0] === "function") {
            return callback(args[0], args.slice(1) as any) || args[0];
        }
        else {
            return (...functionData: any[]) => {
                if (typeof functionData[2]?.value === "function") {
                    const func = functionData[2].value;
                    functionData[2].value = function (this, ...funcArgs: any[]) {
                        if (!this[ObjectUniqueIdSymbol]) {
                            this[ObjectUniqueIdSymbol] = Date.now();
                        }

                        const key = `${this[ObjectUniqueIdSymbol]}`;

                        if (!funcs[key]) {
                            funcs[key] = callback((...args: any[]) => func.apply(this, args), args as any);
                        }

                        return funcs[key](...funcArgs);
                    }
                }
                else {
                    return callback(functionData[0], args as any) || functionData[0];
                }
            }
        }
    }

    return _decorator;
}