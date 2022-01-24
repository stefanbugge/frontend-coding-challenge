export default function mergeClassNames(
  ...args: (string | string[] | undefined)[]
): string {
  return (Array.isArray(args) ? args : [args])
    .reduce<string[]>((acc, arg) => {
      if (arg === undefined) return acc;
      return acc.concat(arg);
    }, [])
    .join(" ");
}

export const noop = () => {};
