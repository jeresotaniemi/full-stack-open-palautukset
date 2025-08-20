const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')
const { createBlog } = require('./helper')

let exampleBlog = {
    title: 'Example Blog',
    author: 'Example Author',
    url: 'http://example.com'
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Jere Sotaniemi',
        username: 'Jerppa',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Testi-Make',
        username: 'Testaaja',
        password: 'salainen'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await loginWith(page, 'Jerppa', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
        await createBlog(page, exampleBlog)
        await expect(page.getByTestId('blog').filter({ hasText: exampleBlog.title })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
        await createBlog(page, exampleBlog)
        const blog = page.getByTestId('blog').filter({ hasText: exampleBlog.title })
        await blog.getByRole('button', { name: 'view' }).click()
        const likes = blog.getByTestId('likes')
        await page.getByRole('button', { name: 'like' }).click()

        await expect(likes).toHaveCount(1)
    })

    test('a blog can be deleted', async ({ page }) => {
      await createBlog(page, exampleBlog)
      const blog = page.getByTestId('blog').filter({ hasText: exampleBlog.title })
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()

      page.on('dialog', async dialog => {
        await expect(dialog.type()).toBe('confirm')
        await expect(dialog.message()).toBe(`Remove blog ${exampleBlog.title} by ${exampleBlog.author}?`)
        await dialog.accept()
      })

      await blog.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByTestId('blog')).toHaveCount(0)
    })

    test('remove button can be seen only by the creator', async ({ page }) => {
      await createBlog(page, exampleBlog)
      await page.getByRole('button', { name: 'logout' }).click()

      await loginWith(page, 'Testaaja', 'salainen')
      const blog = page.getByTestId('blog').filter({ hasText: exampleBlog.title })
      await blog.getByRole('button', { name: 'view' }).click()

      await expect(blog.getByRole('button', { name: 'remove' })).toHaveCount(0)

    })

    test('blogs are sorted in descending order by likes', async ({ page }) => {
      const newBlog = {
        title: 'More liked blog',
        author: 'Better blogger',
        url: 'http://example.com'
      }

      await createBlog(page, exampleBlog)
      await createBlog(page, newBlog)

      const blogToLike = page.getByTestId('blog').filter({ hasText: newBlog.title })
      await blogToLike.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      const blogs = page.getByTestId('blog')
      const blogElements = await blogs.all()

      const likes = []

      for (const blog of blogElements) {
        const likesText = await blog.getByTestId('likes').textContent()
        const likeCount = parseInt(likesText.replace('likes: ', ''), 10)
        likes.push(likeCount)
      }

      for (let i = 0; i < likes.length - 1; i++) {
        expect(likes[i]).toBeGreaterThanOrEqual(likes[i + 1])
      }
    })
  })
})