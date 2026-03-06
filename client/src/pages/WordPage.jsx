import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

function WordPage() {
  const { id } = useParams()
  const [word, setWord] = useState(null)
  const [selectedIndices, setSelectedIndices] = useState(null)
  const [consonanceResults, setConsonanceResults] = useState([])
  const [selectedNucleiIndices, setSelectedNucleiIndices] = useState(null)
  const [rhymeResults, setRhymeResults] = useState([])
  const consonanceCache = useRef({})
  const rhymeCache = useRef({})
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    setWord(null)
    setSelectedIndices(null)
    setConsonanceResults([])
    setSelectedNucleiIndices(null)
    setRhymeResults([])

    fetch(`/api/words/${id}`)
      .then(res => res.json())
      .then(data => {
        setWord(data)
        const onsets = data.onset_permutation.trim().split('\xa0')
        setSelectedIndices(onsets.map((_, i) => i))
        const nuclei = data.rhyme_permutation.trim().split('\xa0')
        setSelectedNucleiIndices([nuclei.length - 1])
      })
  }, [id])

  useEffect(() => {
    if (!selectedIndices || !word) return
    const onset_perm = word.onset_permutation.trim().split('\xa0')
    const key = selectedIndices.map(i => onset_perm[i]).sort().join('\xa0')
    if (!key) {
      setConsonanceResults([])
      return
    }
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
  }, [selectedIndices, id])

  useEffect(() => {
    if (!selectedNucleiIndices || !word) return
    const rhyme_perm = word.rhyme_permutation.trim().split('\xa0')
    const key = selectedNucleiIndices.map(i => rhyme_perm[i]).join('\xa0')
    if (!key) {
      setRhymeResults([])
      return
    }
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
  }, [selectedNucleiIndices])

  if (!word || !selectedIndices || selectedNucleiIndices === null) return <div>Loading...</div>

  const onset_perm = word.onset_permutation.trim().split('\xa0')
  const rhyme_perm = word.rhyme_permutation.trim().split('\xa0')
  const unique_onset_perms = [...new Set(consonanceResults.map(r => r.onset_permutation))]
  const unique_end_distance = [...new Set(rhymeResults.map(r => r.distanceToEnd))]

  const handleOnsetChange = (index) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index))
    } else {
      setSelectedIndices([...selectedIndices, index])
    }
  }

  const handleNucleusChange = (index) => {
    if (selectedNucleiIndices.includes(index)) {
      setSelectedNucleiIndices(selectedNucleiIndices.filter(i => i !== index))
    } else {
      const newSelected = rhyme_perm
        .map((_, i) => i)
        .filter(i => selectedNucleiIndices.includes(i) || i === index)
      setSelectedNucleiIndices(newSelected)
    }
  }

  const toKhmerNumeral = (n) => {
    const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']
    return String(n).split('').map(d => khmerDigits[parseInt(d)]).join('')
  }

  return (
    <div style={{margin: '0 auto', padding: '3rem' }}>
      <ArrowBackIcon sx={{ fontSize: 30 }} onClick={() => navigate('/')} />

      <h1 style={{textAlign: 'center'}}>{word.word}</h1>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} variant="fullWidth">
        <Tab label="ចួន" sx={{ fontSize: '1.2rem' }} />
        <Tab label="រណ្ដំ" sx={{ fontSize: '1.2rem' }} />
      </Tabs>

      {activeTab === 0 && (
        <>
          <div style={{display: 'flex', justifyContent: 'center', margin: '1rem 0'}}>
            <ToggleButtonGroup>
              {rhyme_perm.map((nc, index) => (
                <ToggleButton
                  key={index}
                  value={index}
                  selected={selectedNucleiIndices.includes(index)}
                  onChange={() => handleNucleusChange(index)}
                >
                  {nc}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>

          <ul>
            {unique_end_distance.map(d => {
              const wordsAtDistance = rhymeResults.filter(r => r.distanceToEnd === d)
              const unique_syllable_counts = [...new Set(wordsAtDistance.map(r => r.syllable_count))]
              return (
                <div key={d}>
                  <h2 style={{textAlign: 'center'}}>{`${toKhmerNumeral(d)}`}</h2>
                  {unique_syllable_counts.map(sc => (
                    <div key={sc}>
                      <strong style={{ fontFamily: 'Garamond, "EB Garamond", serif', fontSize: '1.1em' }}>{`(${sc}) `}</strong>
                      {wordsAtDistance.filter(r => r.syllable_count === sc).map(w => (
                        <span key={w.id} onClick={() => { navigate(`/word/${w.id}`); window.scrollTo(0, 0) }} style={{cursor: 'pointer'}}>{w.word} </span>
                      ))}
                    </div>
                  ))}
                </div>
              )
            })}
          </ul>
        </>
      )}

      {activeTab === 1 && (
        <>
          <div style={{display: 'flex', justifyContent: 'center', margin: '1rem 0'}}>
            <ToggleButtonGroup>
              {onset_perm.map((o, index) => (
                <ToggleButton
                  key={index}
                  value={index}
                  selected={selectedIndices.includes(index)}
                  onChange={() => handleOnsetChange(index)}
                >
                  {o}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>

          {unique_onset_perms.map(p => (
            <div key={p}>
              <h2 style={{textAlign: 'center'}}>{p}</h2>
              {consonanceResults.filter(w => w.onset_permutation === p).map(r => (
                <span key={r.id} onClick={() => { navigate(`/word/${r.id}`); window.scrollTo(0, 0) }} style={{cursor: 'pointer'}}>{r.word} </span>
              ))}
            </div>
          ))}
        </>
      )}

    </div>
  )
}

export default WordPage