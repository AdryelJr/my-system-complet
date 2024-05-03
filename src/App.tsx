import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles/global.scss'
import { Layout } from './Pages/Layout'
import { Settings } from './Pages/Settings'
import { Help } from './Pages/Help'
import { Home } from './Pages/Home'

export function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}