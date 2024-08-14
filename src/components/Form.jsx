import React, { useEffect, useRef } from "react";

export default function Form({ handleSubmit, inputValue, setInputValue }) {
  const inputFocus = useRef(null);
  useEffect(() => {
    inputFocus.current.focus();
  }, []);
  return (
    <form onSubmit={handleSubmit} className="flex p-6">
      <div className="flex rounded-lg border border-gray-700 bg-gray-800 w-dvw">
        <input
          ref={inputFocus}
          type="text"
          className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="submit"
          className="flex-shrink bg-transparent px-4 py-2 text-white font-semibold outline-none border-gray-700 border border-r-0 border-t-0 border-b-0"
        >
          Send
        </button>
      </div>
    </form>
  );
}
