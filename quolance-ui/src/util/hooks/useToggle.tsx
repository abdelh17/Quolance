import { useState } from "react";

function useToggle() {
  const [menuToggle, setToggle] = useState<null | string>(null);

  function handleToggle(idx: string) {
    if (menuToggle === idx) {
      setToggle(null);
    } else {
      setToggle(idx);
    }
  }

  return { menuToggle, handleToggle };
}

export default useToggle;