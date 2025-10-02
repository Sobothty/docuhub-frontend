"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "../lib/hook";
import { increment } from "../feature/counter/counterSlice";

const ReduxCounter: React.FC = () => {
  const count = useAppSelector((state) => state.counter.count);
  const dispatch = useAppDispatch();

  const handleIncrement = () => {
    dispatch(increment());
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <h2 className="text-xl font-semibold">Redux Counter</h2>
      <div className="text-3xl font-bold">{count}</div>
      <div className="flex gap-2">
        <button
          onClick={handleIncrement}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ReduxCounter;
