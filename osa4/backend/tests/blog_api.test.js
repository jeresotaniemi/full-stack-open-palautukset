const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  //Initialize token variable
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const newUser = { username: 'testaaja22', password: 'testimies' }
    token = await helper.getToken(newUser)

    for (const blog of helper.initialBlogs) {
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blog)
    }
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(e => e.title)
    assert(contents.includes('React patterns'), true)
  })

  test('blog identifier is returned as "id" and not "_id"', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      assert(blog.id, 'Blog id is missing')
      assert(!blog._id, 'Blog _id should not be present')
    })
  })

  describe('addition of a new blog', () => {
    test('a valid blog can be added and number of blogs increases by one', async() => {
      const newBlog = {
        title: 'New Blog',
        author: 'John Doe',
        url: 'https://example.com/new-blog',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const contents = blogsAtEnd.map(b => b.title)
      assert(contents.includes('New Blog'), true)
    })

    test('"likes" set to 0 if "likes" is empty', async () => {
      const newBlog = {
        title: 'New Blog',
        author: 'John Doe',
        url: 'https://example.com/new-blog'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const addedBlog = blogsAtEnd.find(b => b.title === 'New Blog')
      assert.strictEqual(addedBlog.likes, 0)
    })

    test('return status 400 if no title or url', async () => {
      const newBlog = {
        author: 'John Doe',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('return status 401 if no token', async () => {
      token = ''

      const newBlog = {
        title: 'New Blog',
        author: 'John Doe',
        url: 'https://example.com/new-blog',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const contents = blogsAtEnd.map(b => b.title)
      assert(!contents.includes(blogToDelete.title))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('editing a blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
      const blogsAtStart  = await helper.blogsInDb()
      const blogToEdit = blogsAtStart[0]

      const modifiedBlog = {
        title: 'Updated Title',
        author: blogToEdit.author,
        url: blogToEdit.url,
        likes: 45
      }

      await api
        .put(`/api/blogs/${blogToEdit.id}`)
        .send(modifiedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(b => b.id === blogToEdit.id)
      assert.strictEqual(updatedBlog.title, modifiedBlog.title)
      assert.strictEqual(updatedBlog.likes, modifiedBlog.likes)
    })
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'jeres',
      name: 'Jere Sotaniemi',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 're',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('username and password must be at least 3 characters'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'SuperMan',
      name: 'Superuser',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('username/password missing or not valid'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})



after(async () => {
  await mongoose.connection.close()
})