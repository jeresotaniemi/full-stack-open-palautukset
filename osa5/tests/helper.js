const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, content) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByPlaceholder('title').fill(content.title)
  await page.getByPlaceholder('author').fill(content.author)
  await page.getByPlaceholder('url').fill(content.url)
  await page.getByRole('button', { name: 'create' }).click()

  await page.getByTestId('blog').filter({ hasText: content.title }).waitFor()
}

export { loginWith, createBlog }