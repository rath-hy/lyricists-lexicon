import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

function WordPage() {
  const { id } = useParams()
  const [word, setWord] = useState(null)
  const [selected, setSelected] = useState(null)
  const [results, setResults] = useState([])
  const cache = useRef({})

  useEffect(() => {
    fetch(`/api/words/${id}`)
      .then(res => res.json())
      .then(data => {
        setWord(data)
        const onsets = data.onset_permutation.trim().split('\xa0')
        setSelected(onsets)
      })
  }, [id])

  useEffect(() => {
    if (!selected) return

    console.log('onset combo', JSON.stringify(word.onset_combination))
    const key = [...selected].sort().join('\xa0')

    if (cache.current[key]) {
      setResults(cache.current[key])
      return
    }

    const dbSeparator = word.onset_combination.match(/\s+/)[0]
    console.log('db separator code:', dbSeparator.charCodeAt(0))
    console.log('join separator code:', '\xa0'.charCodeAt(0))
    console.log('key', key)

    fetch(`/api/consonance?onset_combo=${key}`)
      .then(res => res.json())
      .then(data => {
        cache.current[key] = data
        setResults(data)
        console.log('results', data)
      })
  }, [selected])

  if (!word || !selected) return <div>Loading...</div>

  const onset_perm = word.onset_permutation.trim().split(/\s+/)

  const handleOnsetChange = (o) => {
    if (selected.includes(o)) {
      setSelected(selected.filter(item => item !== o))
    } else {
      setSelected([...selected, o])
    }
  }

  const unique_onset_perms = [...new Set(results.map(r => r.onset_permutation))].sort()
  console.log('unique onset perms', unique_onset_perms)

  return (
    <div>
      <h1>{word.word}</h1>
      <fieldset>
        <legend>រណ្ដំ</legend>
        {onset_perm.map((o, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`onset-${index}`}
              value={o}
              checked={selected.includes(o)}
              onChange={() => handleOnsetChange(o)}
            />
            <label htmlFor={`onset-${index}`}>{o}</label>
          </div>
        ))}
      </fieldset>
      <ul>
        {unique_onset_perms.map(p => (
          <div key={p}>
            <h2>{p}</h2>
            {results.filter(w => w.onset_permutation === p).map(r => (
              <div key={r.id}>{r.word}</div>
            ))}
          </div>
        ))}
      </ul>
    </div>
  )
}

export default WordPage