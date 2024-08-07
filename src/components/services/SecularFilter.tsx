
import type { Component } from "solid-js";
interface Props {
  // Define the type for the filterPosts prop
  filterPostsBySecular: (secular: boolean) => void;
}
export const SecularFilter: Component<Props> = (props) => {

  return (
    <div>

      <div class="flex flex-row pr-2">
        <div>
          <span class="text-ptext1 dark:text-ptext1-DM">
            Secular
          </span>
        </div>
        <div>
          <input
            type="checkbox"
            class={`ml-2 leading-tight`}
            onClick={() => {
              console.log("secular filter: " + props.filterPostsBySecular);
            }}
          />
        </div>

      </div>
    </div>
  )
}
