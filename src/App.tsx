import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles/global.scss'
import { Layout } from './Pages/Layout'
import { Settings } from './Pages/Settings/Settings'
import { Help } from './Pages/Help'
import { Home } from './Pages/Home'
import { Profile } from './Pages/Settings/Profile'
import { Appearance } from './Pages/Settings/Appearance'
import { Login } from './Pages/Auth/Login'
import { AuthContextProvider } from './contexts/userAuth'
import { TodoList } from './Pages/Todo-list'
import { MiniBank } from './Pages/MiniBank'
import { LojaPage } from './Pages/MiniBank/LojaPage'
import { TransacoesPage } from './Pages/MiniBank/TransacoesPage'

export function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/help" element={<Help />} />
            <Route path="/tolist" element={<TodoList />} />
            <Route path="/minibank" element={<MiniBank />}>
              <Route path="loja" element={<LojaPage />} />
              <Route path="transacoes" element={<TransacoesPage />} />
            </Route>
            <Route path="/settings" element={<Settings />}>
              <Route path="/settings" element={<Profile />} />
              <Route path="appearance" element={<Appearance />} />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Layout />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  )
}