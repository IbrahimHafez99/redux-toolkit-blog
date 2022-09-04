import React from 'react'

const reactionEmoji = {
  thumbsUp: '👍🏻',
  wow: '😲',
  heart: '❤',
  rocket: '🚀',
  coffee: '☕',
}

const ReactionButtons = ({ post }) => {

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type='button'
        className='reactionButton'
      >
        {emoji} {post.reactions[name]}
      </button>
    )
  })
  return <div>{reactionButtons}</div>
}

export default ReactionButtons