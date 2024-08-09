import { fetchFilteredPosts } from "@components/posts/fetchPosts";
import { createSignal, onMount, type Component } from "solid-js";
interface Props {
  // Define the type for the filterPosts prop
  filterPostsBySecular: (secular: boolean) => void;
}
export const SecularFilter: Component<Props> = (props) => {
  const [selectedSecular, setSelectedSecular] = createSignal<boolean>(false)


  function initializeSecular(e: Event) {
    if ((e.target as HTMLInputElement)?.checked) {
      setSelectedSecular((e.target as HTMLInputElement)?.checked)
      props.filterPostsBySecular(selectedSecular())
    }

  }

  onMount(() => {
    if (localStorage.getItem("selectedSecular")) {
      setSelectedSecular(JSON.parse(localStorage.getItem("selectedSecular")!));
    }
  });


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
            checked={selectedSecular()}
            onClick={(e) => {
              initializeSecular(e)
            }}
          />
        </div>

      </div>
    </div>
  )
}
