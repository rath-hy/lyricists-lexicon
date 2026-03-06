import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Paper from '@mui/material/Paper'

const strings = {
  km: {
    title: 'គម្ពីរកវី',
    subtitle: 'ដោយ Puthyrathy',
    placeholder: 'ស្វែងរកពាក្យចួននិងពាក្យរណ្ដំជាមួយ...',
    langToggle: 'English',
  },
  en: {
    title: "Lyricist's Lexicon",
    subtitle: 'by Puthyrathy',
    placeholder: 'Search for rhymes and consonances...',
    langToggle: 'ខ្មែរ',
  }
}

function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [lang, setLang] = useState('km')
  const navigate = useNavigate()
  const t = strings[lang]

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
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      position: 'relative',
    }}>

    <div style={{
      position: 'absolute',
      bottom: '1.5rem',
      right: '1.5rem',
      fontSize: '1rem',
      color: '#888',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      
      <span>ហ៊ី​ ពុទ្ធីរតន៍</span>
      <HelpOutlineIcon onClick={() => navigate('/about')}
        style={{ cursor: 'pointer', fontWeight: 'bold' }} />
    </div>

      <div style={{ width: '500px', position: 'relative' }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '300',
          letterSpacing: '0.05em',
          textAlign: 'center',
          position: 'absolute',
          width: '100%',
          bottom: '100%',
          marginBottom: '1.5rem'
        }}>
          {t.title}
        </h1>

        <TextField
          fullWidth
          variant="outlined"
          placeholder={t.placeholder}
          value={query}
          onChange={handleChange}
          autoComplete="off"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
            }
          }}
        />

        {results.length > 0 && (
          <Paper elevation={3} style={{
            position: 'absolute',
            width: '100%',
            zIndex: 10,
            borderRadius: '12px',
            marginTop: '4px',
            maxHeight: '250px',
            overflowY: 'auto'
          }}>
            <List disablePadding>
              {results.map(word => (
                <ListItemButton
                  key={word.id}
                  onClick={() => {
                    navigate(`/word/${word.id}`)
                    window.scrollTo(0, 0)
                  }}
                >
                  <ListItemText primary={word.word} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </div>
    </div>
  )
}

export default Home