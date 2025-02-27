import './styles/global.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Dashboard'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Recipes from './components/Recipes'
import UserProvider from './context/Provider'
import Dashboard from './components/Dashboard'

function App() {

  return (
    <UserProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Dashboard />}/>
          <Route path="/recipes" element={<Recipes />}/>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/login" element={<Header />} /> */}
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </Router>
    </UserProvider>
    )
}

export default App
