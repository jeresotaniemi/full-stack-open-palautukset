import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const [infoVisible, setInfoVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: infoVisible ? 'none' : '' }
  const showWhenVisible = { display: infoVisible ? '' : 'none' }
  const showRemove = blog.user && blog.user.username === currentUser.username

  return (
    <div data-testid='blog' style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title}
        <button onClick={() => setInfoVisible(true)}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} by {blog.author}
        <button onClick={() => setInfoVisible(false)}>hide</button>
        <div>
          <a href={blog.url} target='_blank' rel='noopener noreferrer'>
            {blog.url}
          </a>
        </div>
        <div data-testid='likes'>
          likes: {blog.likes} <button onClick={handleLike}>like</button>
        </div>
        <div>{blog.user ? blog.user.name : 'Unknown user'}</div>
        {showRemove && (
          <button onClick={handleDelete}>remove</button>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired
}

export default Blog