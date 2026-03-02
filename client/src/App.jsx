import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import WordPage from './pages/WordPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/word/:id" element={<WordPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App