import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WhisperingWallsDashboard from "./pages/dashboard.jsx";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <WhisperingWallsDashboard />
    </>
  )
}

export default App
