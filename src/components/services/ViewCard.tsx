import type { Component } from 'solid-js';

interface Post {
  content: string;
  id: number;
  category: string;
  title: string;
  provider_name: string;
  major_municipality: string;
  minor_municipality: string;
  governing_district: string;
  user_id: string;
}

interface Props {
  // Define the type for the filterPosts prop
  posts: Array<Post>;
}

export const ViewCard: Component<Props> = (props) => {

  return (
    <div>
      <ul>
        {
          props.posts.map((post: any) => (
            <li>
              <div class='border-8 border-red-500'>
              <p>{post.title}</p>
              <p>{post.content}</p>
              <p>Provider: {post.provider_name}</p>
              <p>Location: {post.major_municipality}/{post.minor_municipality}/{post.governing_district}</p>
              <p>Category: {post.category}</p>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
