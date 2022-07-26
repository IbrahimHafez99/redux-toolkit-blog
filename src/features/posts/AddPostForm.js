import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux/es/exports'
import { postAdded, addNewPost, resetRequestStatus } from './postsSlice'
import { useNavigate } from 'react-router-dom'
import { selectAllUsers } from '../users/usersSlice'
import { add } from 'date-fns'

const AddPostForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState('idle')

  const users = useSelector(selectAllUsers)
  const { postId, requestStatus } = useSelector(state => state.posts)
  const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

  const onTitleChange = e => setTitle(e.target.value)
  const onContentChange = e => setContent(e.target.value)
  const onAuthorChange = e => setUserId(e.target.value)
  useEffect(() => {
    if (requestStatus === 200) {
      navigate(`/post/${postId}`)
      dispatch(resetRequestStatus())
    }
  }, [dispatch, postId, navigate, requestStatus])
  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        dispatch(addNewPost({ title, body: content, userId })).unwrap()
        setTitle('')
        setContent('')
        setUserId('')
      } catch (err) {
        console.error('Failed to save the post', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }

  const userOptions = users.map(user => (
    <option key={user.id} value={user.id}>{user.name}</option>
  ))
  return (
    <section>
      <h2>Add a New Post</h2>
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
        <select id='postAuthor' value={userId} onChange={onAuthorChange}>
          <option key="" value="" disabled>Select the author</option>
          {userOptions}
        </select>
        <label htmlFor='postContent'>Content:</label>
        <textarea
          id='postContent'
          name='postContent'
          value={content}
          onChange={onContentChange}
        />
        <button type='button' disabled={!canSave} onClick={onSavePostClicked}>Save Post</button>
      </form>
    </section>
  )
}

export default AddPostForm