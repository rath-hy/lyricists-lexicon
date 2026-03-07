import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useState } from 'react'

const content = {
  en: {
    title: "About",
    body: [
      <>
        This is the website version of The Lyricist's Lexicon (nicknamed the "poet's dictionary"), a pair of books that catalogue rhymes and consonances in Khmer. Authored in 2024 by Puthyrath Hy, the books can be downloaded <a href="https://drive.google.com/drive/folders/1XWe2odMrgn3ZwdIoZfhy2WHQG7_HgCDx?usp=sharing" target="_blank" rel="noreferrer">here</a>. If you'd like to learn more about their genesis, please visit the <a href="https://puthyrathy.com" target="_blank" rel="noreferrer">author's personal website</a>.
      </>,
      `"Consonance" is the English translation the author chose for the Khmer concept of rundom (រណ្ដំ). Technically, rundom is a general term that can refer to either the matching of consonants or of vowels, but because vowel rundom bears similarities to rhyme, the Lyricist's Lexicon uses rundom exclusively to refer to the matching of initial consonant sounds across words, as in "bitter", "batter", and "butter". A more precise if less melodious translation would be cluster alliteration.`,
      `Please contact puthyrathy@gmail.com to report a bug or an error.`
    ],
  },
  km: {
    title: "អំពីគម្ពីរកវី",
    body: [
      <>
        គម្ពីរកវី ជាកម្រងពាក្យចួននិងពាក្យរណ្ដំក្នុងភាសាខ្មែរ។ វេបសាយនេះជាទម្រង់អាឡិចត្រូនិចនៃសៀវភៅពីរក្បាលដែលនិពន្ធដោយ ហ៊ី ពុទ្ធីរតន៍ នៅឆ្នាំ ២០២៤។ អ្នកអាចទាញយកសៀវភៅមួយគូនេះដោយឥតគិតថ្លៃតាមរយៈ<a href="https://drive.google.com/drive/folders/1XWe2odMrgn3ZwdIoZfhy2WHQG7_HgCDx?usp=sharing" target="_blank" rel="noreferrer">តំណភ្ជាប់នេះ</a>។ បើអ្នកចង់ដឹងបន្ថែមអំពីដំណើរចងក្រងគម្ពីរកវី អ្នកអាចធ្វើដំណើរទៅកាន់<a href="https://puthyrathy.com" target="_blank" rel="noreferrer">វេបសាយផ្ទាល់របស់ ហ៊ី ពុទ្ធីរតន៍</a>។
      </>,
      `តាមការពិតទៅ រណ្ដំបែងចែកជារណ្ដំស្រៈនិងរណ្ដំព្យញ្ជនៈ ប៉ុន្តែពីព្រោះរណ្ដំស្រៈស្រដៀងនឹងចួន ក្នុងគម្ពីរកវី «រណ្ដំ» សម្ដៅទៅលើតែរណ្ដំព្យញ្ជនៈប៉ុណ្ណោះ។ នៅលើទំព័រចួនរបស់ពាក្យនីមួយៗ ទិន្នន័យបែងចែកតាមរយៈគម្លាតរវាងសម្លេងចួននិងចុងពាក្យ។ ដូច្នេះក្រុម «០» គឺពាក្យទាំងអស់ដែលមានសម្លេងចួនស្ថិតនៅខាងចុងពាក្យ។ នៅក្នុងក្រុមនីមួយៗ ទិន្នន័យបែងចែកបន្តទៀតតាមរយៈចំនួនព្យាង្គ។`,
      `គម្ពីរកវីត្រូវបានចងក្រងដោយនិស្សិតវ័យម្ភៃឆ្នាំក្នុងរយៈពេលពីរខែ។ សូមមេត្តាទាក់ទងទៅកាន់ puthyrathy@gmail.com ប្រសិនបើអ្នករកឃើញកំហុសឆ្គងណាមួយ។`
    ],
  }
}

function About() {
  const navigate = useNavigate()
  const [lang, setLang] = useState('km')
  const t = content[lang]

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem', fontFamily: 'Garamond, "EB Garamond", serif', fontSize: lang === 'km' ? '1rem' : '1.1rem'  }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <ArrowBackIcon onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
        <span
          onClick={() => setLang(lang === 'km' ? 'en' : 'km')}
          style={{ cursor: 'pointer', color: '#555', fontSize: '0.9rem' }}
        >
          {lang === 'km' ? 'English' : 'ខ្មែរ'}
        </span>
      </div>

      <h1 style={{ marginBottom: '2rem' }}>{t.title}</h1>

      {t.body.map((paragraph, i) => (
        <p key={i} style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>{paragraph}</p>
      ))}

    </div>
  )
}

export default About
