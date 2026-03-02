import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const navigate = useNavigate()

  const handleChange = async (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.trim() === '') {
      setResults([])
      return
    }

    const response = await fetch(`/api/search?query=${value}`)
    const data = await response.json()
    setResults(data)
  }

  return (
    <div>
      <h1>គម្ពីរកវី</h1>
      <input
        type="text"
        value={query}
        onChange={handleChange}
      />
      <ul>
        {results.map(word => (
          <li key={word.id} onClick={() => navigate(`/word/${word.id}`)}>
            {word.word}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home