import { useSelector } from "react-redux"
import { selectUserById } from "./usersSlice"
import { selectAllPosts } from "../posts/postsSlice"
import { Link, useParams } from "react-router-dom"

const UserPage = () => {
  const { userId } = useParams()
  const user = useSelector(state => selectUserById(state, Number(userId)))

  const postsForUser = useSelector(state => {
    const allPosts = selectAllPosts(state)
    return allPosts.filter(post => post.userId === Number(userId))
  })
  const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </li>
  ))
  return (
    <section>
      <h2>
        {user?.name}
        <ol>{postTitles}</ol>
      </h2>
    </section>
  )
}

export default UserPage