import './styles/global.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import SignUp from './components/SignUp'
import Recipes from './components/Recipes'
import UserProvider from './context/Provider'
import Dashboard from './components/Dashboard'
import EditRecipePage from './components/EditRecipePage'
import AddRecipePage from './components/AddRecipePage'
import Login from './components/Login'
import { Home } from '@mui/icons-material'

function App() {

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/login" element={<Login isDarkMode={false} />} />
          <Route path="/sign-up" element={<SignUp isDarkMode={false} />} />
          <Route path="/edit/:id" element={<EditRecipePage />} />
          <Route path="/add-recipe" element={<AddRecipePage />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
