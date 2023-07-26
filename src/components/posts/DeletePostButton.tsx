import { Component } from "solid-js";

export const DeletePostButton: Component = () => {
  return (
    <div>
      <button
        onclick={() => {
          console.log("delete Post");
        }}
      >
        Deleteeeeeeeee
      </button>
    </div>
  );
};
