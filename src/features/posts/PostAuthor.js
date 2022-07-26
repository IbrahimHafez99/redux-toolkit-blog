import { useSelector, useDispatch } from "react-redux/es/exports";
import { selectAllUsers } from "../users/usersSlice";

import React from 'react'

const PostAuthor = ({ userId }) => {
  const users = useSelector(selectAllUsers)
  const author = users.find(user => user.id === userId)

  return (
    <span>by {author?.name || 'Uknown author'}</span>
  )
}

export default PostAuthor