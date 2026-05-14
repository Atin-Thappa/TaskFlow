import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <h1 className="text-white font-bold text-xl">TaskFlow</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-sm">{user.name}</span>
        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar