import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectPostById, updatePost, deletePost } from './postsSlice'
import { useParams, useNavigate } from 'react-router-dom'
import { selectAllUsers } from '../users/usersSlice'
import { useDeletePostMutation, useUpdatePostMutation } from './postsSlice'
const EditPostForm = () => {
  const { postId } = useParams()
  const navigate = useNavigate()

  const [updatePost, { isLoading }] = useDeletePostMutation()
  const [deletePost] = useDeletePostMutation()

  const post = useSelector(state => selectPostById(state, postId))
  const users = useSelector(selectAllUsers)
  const [title, setTitle] = useState(post?.title)
  const [content, setContent] = useState(post?.body)
  const [userId, setUserId] = useState(post?.userId)

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const onTitleChange = e => setTitle(e.target.value)
  const onContentChange = e => setContent(e.target.value)
  const onAuthorChange = e => setUserId(e.target.value)

  const canSave = [title, content, userId].every(Boolean) && !isLoading

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        await updatePost({ id: post.id, title, body: content, userId, reactions: post.reactions }).unwrap()
        setTitle('')
        setContent('')
        setUserId('')
        navigate(`/post/${postId}`)
      }
      catch (err) {
        console.error('Failed to save the post', err)
      }
    }
  }
  const usersOptions = users.map(user => (
    <option
      key={user.id}
      value={user.id}
    >
      {user.name}
    </option>
  ))
  const onDeletePostClicked = async () => {
    try {
      await deletePost({ id: post.id }).unwrap()
      setTitle('')
      setContent('')
      setUserId('')
      navigate('/')
    } catch (err) {
      console.error('Failed to delete the post', err)
    }
  }
  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor='postTitle'>Post Title:</label>
        <input
          type='text'
          id='postTitle'
          name='postTitle'
          value={title}
          onChange={onTitleChange}
        />
        <label htmlFor='postAuthor'>Author:</label>
        <select id='postAuthor' defaultValue={userId} onChange={onAuthorChange}>
          <option value="" disabled>Select an author</option>
          {usersOptions}
        </select>
        <label htmlFor='postContent'>Content:</label>
        <textarea
          id='postContent'
          name='postContent'
          value={content}
          onChange={onContentChange}
        />
        <button
          type='button'
          onClick={onSavePostClicked}
          disabled={!canSave}
        >
          Save Post
        </button>
        <button className='deleteButton'
          type='button'
          onClick={onDeletePostClicked}>
          Delete Post
        </button>
      </form>
    </section>
  )
}

export default EditPostForm