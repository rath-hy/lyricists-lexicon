import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function WordPage() {
  const { id } = useParams()
  const [word, setWord] = useState(null)

  useEffect(() => {
    fetch(`/api/words/${id}`)
      .then(res => res.json())
      .then(data => setWord(data))
  }, [id])

  if (!word) return <div>Loading...</div>

  return (
    <div>
      <h1>{word.word}</h1>
    </div>
  )
}

export default WordPage