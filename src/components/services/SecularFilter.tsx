
import type { Component } from "solid-js";
interface Props {
  // Define the type for the filterPosts prop
  filterPostsBySecular: (secular: boolean) => void;
}
export const SecularFilter: Component<Props> = (props) => {

  console.log(props.filterPostsBySecular)
  return (
    <div>
      <h1>Secular Filter Comp</h1>

    </div>
  )
}
