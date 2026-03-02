import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function WordPage() {
  const { id } = useParams()
  const [word, setWord] = useState(null)
  const [selected, setSelected] = useState(null)
  const [consonanceResults, setConsonanceResults] = useState([])
  const [selectedNuclei, setSelectedNuclei] = useState(null)
  const [rhymeResults, setRhymeResults] = useState([])
  const consonanceCache = useRef({})
  const rhymeCache = useRef({})
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`/api/words/${id}`)
      .then(res => res.json())
      .then(data => {
        setWord(data)
        const onsets = data.onset_permutation.trim().split('\xa0')
        setSelected(onsets)
        const nuclei = data.rhyme_permutation.trim().split('\xa0')
        setSelectedNuclei([nuclei[nuclei.length - 1]])
      })
  }, [id])

  useEffect(() => {
    if (!selected) return
    const key = [...selected].sort().join('\xa0')
    if (consonanceCache.current[key]) {
      setConsonanceResults(consonanceCache.current[key])
      return
    }
    fetch(`/api/consonance?onset_combo=${key}`)
      .then(res => res.json())
      .then(data => {
        consonanceCache.current[key] = data
        setConsonanceResults(data)
      })
  }, [selected])

  useEffect(() => {
    if (!selectedNuclei) return
    const key = selectedNuclei.join('\xa0')
    if (rhymeCache.current[key]) {
      setRhymeResults(rhymeCache.current[key])
      return
    }
    fetch(`/api/rhyme?nuclei=${encodeURIComponent(key)}`)
      .then(res => res.json())
      .then(data => {
        rhymeCache.current[key] = data
        setRhymeResults(data)
      })
  }, [selectedNuclei])

  if (!word || !selected || !selectedNuclei) return <div>Loading...</div>

  const onset_perm = word.onset_permutation.trim().split('\xa0')
  const rhyme_perm = word.rhyme_permutation.trim().split('\xa0')
  const unique_onset_perms = [...new Set(consonanceResults.map(r => r.onset_permutation))]

  const handleOnsetChange = (o) => {
    if (selected.includes(o)) {
      setSelected(selected.filter(item => item !== o))
    } else {
      setSelected([...selected, o])
    }
  }

  const unique_end_distance = [...new Set(rhymeResults.map(r => r.distanceToEnd))]

  const handleNucleusChange = (nc) => {
    let newSelected
    if (selectedNuclei.includes(nc)) {
      newSelected = selectedNuclei.filter(item => item !== nc)
    } else {
      newSelected = rhyme_perm.filter(item => selectedNuclei.includes(item) || item === nc)
    }
    setSelectedNuclei(newSelected)
  }

  return (
    <div>
      <h1>{word.word}</h1>

      <fieldset>
        <legend>រណ្ដំ (Consonance)</legend>
        {onset_perm.map((o, index) => (
          <div key={index} style={{display: 'inline'}}>
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

      {unique_onset_perms.map(p => (
        <div key={p}>
          <h2>{p}</h2>
          {consonanceResults.filter(w => w.onset_permutation === p).map(r => (
            <span key={r.id} onClick={() => {navigate(`/word/${r.id}`); window.scrollTo(0, 0)}}>{r.word} </span>
          ))}
        </div>
      ))}

      <fieldset>
        <legend>ចួន (Rhyme)</legend>
        {rhyme_perm.map((nc, index) => (
          <div key={index} style={{display: 'inline'}}>
            <input
              type="checkbox"
              id={`nucleus-${index}`}
              value={nc}
              checked={selectedNuclei.includes(nc)}
              onChange={() => handleNucleusChange(nc)}
            />
            <label htmlFor={`nucleus-${index}`}>{nc}</label>
          </div>
        ))}
      </fieldset>

      <ul>
        {unique_end_distance.map(d => {
          const wordsAtDistance = rhymeResults.filter(r => r.distanceToEnd === d)
          const unique_syllable_counts = [...new Set(wordsAtDistance.map(r => r.syllable_count))]
          return (
            <div key={d}>
              <h2>{d}</h2>
              {unique_syllable_counts.map(sc => (
                <div key={sc}>
                  <h3>{sc}</h3>
                  {wordsAtDistance.filter(r => r.syllable_count === sc).map(w => (
                    
                    <span key={w.id} onClick={() => {navigate(`/word/${w.id}`); window.scrollTo(0, 0)}}>{w.word} </span>
                  ))}
                </div>
              ))}
            </div>
          )
        })}
      </ul>
    </div>
  )
}

export default WordPage