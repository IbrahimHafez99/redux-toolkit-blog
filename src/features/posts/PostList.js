import React from 'react'
import { useSelector } from "react-redux";
import { selectPostIds, getPostsStatus, getPostsError } from './postsSlice';
import PostsExcerpt from './PostsExcerpt';
const PostList = () => {
  const orderedPostIds = useSelector(selectPostIds)
  console.log(orderedPostIds);
  const postsStatus = useSelector(getPostsStatus)
  //the above selectors is equal to this below, the state param get inherited by the get getPostsStatus function automatically
  const postsError = useSelector(state => getPostsError(state))


  let content;
  if (postsStatus === 'loading') {
    content = <p>Loading...</p>
  } else if (postsStatus === 'succeeded') {
    content = orderedPostIds.map(postId => {
      return <PostsExcerpt key={postId} postId={postId} />
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