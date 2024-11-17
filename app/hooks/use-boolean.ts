import { useState } from "react";

export function useBoolean(defaultValue: boolean) {
  const [value, setValue] = useState(defaultValue);

  function setTrue() {
    setValue(true);
  }

  function setFalse() {
    setValue(false);
  }

  function setToggle() {
    setValue((value) => !value);
  }

  const actions = {
    true: setTrue,
    false: setFalse,
    toggle: setToggle,
  };

  return [value, actions] as [typeof value, typeof actions];
}
