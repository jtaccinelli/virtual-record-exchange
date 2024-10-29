import { useMemo } from "react";

type ValueMap = {
  [key: string]: boolean;
};

export function useUi(values: ValueMap) {
  return useMemo(() => {
    const descriptors = Object.entries(values).reduce((set, entry) => {
      const [descriptor, predicate] = entry;
      if (predicate) set.add(descriptor);
      return set;
    }, new Set());

    return [...descriptors].join(" ");
  }, Object.values(values));
}
