import React from 'react'
import { useSelector } from "react-redux";
import { selectAllPosts, getPostsStatus, getPostsError } from './postsSlice';
import PostsExcerpt from './PostsExcerpt';
const PostList = () => {
  const posts = useSelector(state => selectAllPosts(state))
  const postsStatus = useSelector(getPostsStatus)
  const postsError = useSelector(state => getPostsError(state))


  let content;
  if (postsStatus === 'loading') {
    content = <p>Loading...</p>
  } else if (postsStatus === 'succeeded') {
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
    content = orderedPosts.map(post => {
      return <PostsExcerpt key={post.id} post={post} />
    })
  } else if (postsStatus === 'failed') {
    content = <p>{postsError}</p>
  }

  return (
    <section>
      {content}
    </section>
  )
}

export default PostList
// export default React.memo(PostList)