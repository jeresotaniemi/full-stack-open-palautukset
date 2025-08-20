import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog
  let currentUser

  beforeEach(() => {
    blog = {
      title: 'Testing a blog',
      author: 'Testing Man',
      url: 'http://example.com',
      likes: 50,
      user: { username: 'tester123', name: 'Tester' }
    }

    currentUser = { username: 'tester123', name: 'Tester' }
  })

  test('renders content', () => {

    render(<Blog blog={blog} currentUser={currentUser} />)

    const elements = screen.getAllByText('Testing a blog by Testing Man')
    expect(elements[0]).toBeDefined()
  })

  test('renders more content after clicking the button', async () => {

    render(<Blog blog={blog} currentUser={currentUser} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('http://example.com')).toBeDefined()
    expect(screen.getByText('likes: 50')).toBeDefined()
  })

  test('clicking the button twice calls event handler twice', async () => {
    const mockHandler = vi.fn()

    render(<Blog blog={blog} currentUser={currentUser} handleLike={mockHandler} />)


    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})