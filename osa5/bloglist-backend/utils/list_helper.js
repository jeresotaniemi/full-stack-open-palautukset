const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) =>
    sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((previous, current) => {
    if (current.likes > previous.likes) {
      return current
    }
    return previous
  })
}

const mostBlogs = (blogs) => {
  const authorBlogs = _.countBy(blogs, 'author')
  const mostBlogsAuthor = _.maxBy(_.entries(authorBlogs), 1)
  return (
    mostBlogsAuthor
      ? { author: mostBlogsAuthor[0], blogs: mostBlogsAuthor[1] }
      : null
  )
}

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')
  const authorsWithLikes = _.map(groupedByAuthor, (items, author) => ({
    author: author,
    likes: _.sumBy(items, 'likes')
  }))
  const mostLikesAuthor = _.maxBy(authorsWithLikes, 'likes')
  return (
    mostLikesAuthor
      ? { author: mostLikesAuthor.author, likes: mostLikesAuthor.likes }
      : null
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}