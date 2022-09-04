import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux/es/exports'
import { addNewPost } from './postsSlice'
import { useNavigate } from 'react-router-dom'
import { selectAllUsers } from '../users/usersSlice'
import { useAddNewPostMutation } from './postsSlice'
const AddPostForm = () => {
  const [addNewPost, { isLoading }] = useAddNewPostMutation()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')

  const users = useSelector(selectAllUsers)
  const canSave = [title, content, userId].every(Boolean) && !isLoading
  const onTitleChange = e => setTitle(e.target.value)
  const onContentChange = e => setContent(e.target.value)
  const onAuthorChange = e => setUserId(e.target.value)
  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        await addNewPost({ title, body: content, userId }).unwrap()
        navigate(`/`)
        setTitle('')
        setContent('')
        setUserId('')
      } catch (err) {
        console.error('Failed to save the post', err)
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