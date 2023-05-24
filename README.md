# Decraft - Smart TypeScript Decorators

Decraft is a user-friendly npm package that simplifies the creation of TypeScript decorators, significantly enhancing their power and readability. With Decraft, crafting intuitive and efficient decorators is a streamlined and enjoyable experience.

## Starting from the end - How does you use the decorators?

Lets say that we created a decorator named `@myDecorator`. Those are all of the ways that we can use **the same decorator**.

We don't need to create a new decorator for each case, we can just use the same one for all of those cases.

### @myDecorator

The classic way to use decorators. Just put it above a class method.

```typescript
class MyClass {
	@myDecorator
	func(...params) {
		// code
	}
}
```

### @myDecorator(...args)

We can also pass arguments to our decorator.

```typescript
class MyClass {
	@myDecorator(...args)
	func(...params) {
		// code
	}
}
```

### myDecorator(func, args)

> Whooho, This is not a decorator!

You are right. But one of the issues with decorators is that we can't use them in some cases. For example for callbacks or functions outside of a class.

So with decraft, we allow you to use some hacks.

```typescript
const func = myDecorator((...params) => {
	// code
}, ...args);
``` 

or another example:
```typescript
function _func(...params) {
  // code
}

const func = myDecorator(_func, ...args)
```

### myDecorator(...args)(func)

We allow also a different approach for readability.

```typescript
const func = myDecorator(...args)((...params) => {
	// code
});
```

## How to create a decorator?

It's pretty straightforward. We call the `decorator` function and pass as a generic a list of types that will be used for the decorator arguments.

Then we pass a callback which will be called each time we create the function (or the object it exists in). 

It may also return a function, and this function will **replace** the function that the decorator is used on.

```typescript
const  myDecorator  =  decorator<[...DecoratorParamsTypes]>((func, decoratorParams) => {
	// The function that we return here will replace the function that it's being used on
	return (...args:  any[]) => {
		// We're doing nothing, just calling the function
		return  func(...args);
	};

	// If we prefer, we can also return nothing and the decorator function will not replace the function that it's being used on
});
```

## Our best practices

1. We still have several type issues, so we recommend to check that you really got the params you wanted to get.
2. Don't return a function with different type that the one you got. TypeScript not updating the function types right now when using this decorator.
3. When using decorator as a function like this: `myDecorator(func, ...args)` or `myDecorator(...args)(func)` you should set a type to the variable it's assigned to. We return `any` right now as a type.