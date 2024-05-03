import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles/global.scss'
import { Layout } from './Pages/Layout'
import { Settings } from './Pages/Settings'
import { Help } from './Pages/Help'

export function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}