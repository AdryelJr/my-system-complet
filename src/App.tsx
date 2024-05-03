import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles/global.scss'
import { Layout } from './Pages/Layout'
import { Settings } from './Pages/Settings/Settings'
import { Help } from './Pages/Help'
import { Home } from './Pages/Home'
import { Profile } from './Pages/Settings/Profile'
import { Appearance } from './Pages/Settings/Appearance'

export function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/help" element={<Help />} />
          <Route path="/settings" element={<Settings />}>
            <Route path="/settings" element={<Profile />} />
            <Route path="appearance" element={<Appearance />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}