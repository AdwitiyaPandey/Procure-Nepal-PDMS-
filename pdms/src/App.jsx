import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './component/Login'
import Landing from './component/pages/Landing'
import Landingbanner from './component/Landingbanner'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
     
 <Landing/>
     
     </>
  )
}

export default App
