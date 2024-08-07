
import type { Component } from "solid-js";
interface Props {
  // Define the type for the filterPosts prop
  filterPostsBySecular: (secular: string) => void;
}
export const SecularFilter: Component<Props> = (props) => {

  return (
    <div>

      <div class="flex flex-row pl-2">
        <div>
          <span class="text-ptext1 dark:text-ptext1-DM">
            Secular
          </span>
        </div>
        <div>
          <input
            type="checkbox"
            class={`mr-2 leading-tight`}
            onClick={() => {
              console.log("secular filter: " + props.filterPostsBySecular);
            }}
          />
        </div>

      </div>
    </div>
  )
}
