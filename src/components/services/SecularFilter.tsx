
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
    <div class="hidden bg-background1 dark:bg-background1-DM md:mt-2 md:block w-full md:rounded-lg md:border-2 md:border-border2 dark:md:border-border2-DM">
      <div class="md:flex-column flex-wrap h-full pb-2 md:rounded md:border-b-2 md:border-border2 md:text-left dark:md:border-border2-DM">

        <div>
          <div class="flex flex-row pl-2">
            <div class="flex flex-wrap justify-between">
              {/* <div class="w-4/5 pl-4">{t("formLabels.subjects")}</div> */}
              <div class="w-4/5 px-2 ">Secular</div>
            </div>
            <div>
              <input
                type="checkbox"
                class={`mr-2 leading-tight`}
                checked={selectedSecular()}
                onClick={(e) => {
                  initializeSecular(e)
                }}
              />
            </div>

          </div>

        </div>
      </div>
    </div>
  )

}
