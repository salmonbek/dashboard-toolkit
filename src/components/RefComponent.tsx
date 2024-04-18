import { useRef } from "react";

const RefComponent = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <h1>RefComponent</h1>
      <button ref={btnRef}>Register</button>
      <input type="text" ref={inputRef} />
    </div>
  );
};

export default RefComponent;
