import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import WordPage from './pages/WordPage'
import About from './pages/About'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/word/:id" element={<WordPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </>

    
  )
}

export default App