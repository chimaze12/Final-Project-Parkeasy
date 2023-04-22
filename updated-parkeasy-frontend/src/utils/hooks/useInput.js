import { useState } from "react";

const useInput = (initial) => {
  const [value, setValue] = useState(initial);
  return [value, (e) => setValue(e.target.value), () => setValue(initial)];
};

export default useInput;
