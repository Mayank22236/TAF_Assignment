import { useState } from 'react'
import './App.css'

const API_BASE = 'http://localhost:3001'

function App() {
  const [activeTab, setActiveTab] = useState('json')
  const [jsonInput, setJsonInput] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [jsonError, setJsonError] = useState('')
  const [base64Input, setBase64Input] = useState('')
  const [base64Output, setBase64Output] = useState('')
  const [base64Mode, setBase64Mode] = useState('encode')
  const [base64Error, setBase64Error] = useState('')

  // Call backend for JSON formatting
  const handleFormatJson = async () => {
    setJsonError('')
    setJsonOutput('')
    try {
      const res = await fetch(`${API_BASE}/format-Json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: jsonInput })
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setJsonError(data.error || 'Invalid JSON')
      } else {
        setJsonOutput(data.formatted)
      }
    } catch (e) {
      setJsonError('Server error')
    }
  }

  // Call backend for Base64 encode/decode
  const handleBase64 = async () => {
    setBase64Error('')
    setBase64Output('')
    try {
      let url = base64Mode === 'encode' ? '/encode' : '/decode'
      let payload = base64Mode === 'encode' ? { text: base64Input } : { base64: base64Input }
      const res = await fetch(`${API_BASE}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setBase64Error(data.error || 'Error')
      } else {
        setBase64Output(data.encoded || data.decoded)
      }
    } catch (e) {
      setBase64Error('Server error')
    }
  }

  return (
    <div className="dev-toolbox-container">
      <h1>Dev Toolbox</h1>
      <div className="tabs">
        <button className={activeTab === 'json' ? 'active' : ''} onClick={() => setActiveTab('json')}>JSON Formatter</button>
        <button className={activeTab === 'base64' ? 'active' : ''} onClick={() => setActiveTab('base64')}>Base64 Encoder/Decoder</button>
      </div>
      <div className="tab-content">
        {activeTab === 'json' && (
          <div className="json-formatter">
            <textarea
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
              placeholder="Paste raw JSON here"
              rows={8}
              className="input-area"
            />
            <button onClick={handleFormatJson}>Format JSON</button>
            {jsonError && <div className="error">{jsonError}</div>}
            {jsonOutput && (
              <pre className="output-area">{jsonOutput}</pre>
            )}
          </div>
        )}
        {activeTab === 'base64' && (
          <div className="base64-tool">
            <textarea
              value={base64Input}
              onChange={e => setBase64Input(e.target.value)}
              placeholder={base64Mode === 'encode' ? 'Enter plain text' : 'Enter Base64 text'}
              rows={6}
              className="input-area"
            />
            <div className="base64-modes">
              <label>
                <input
                  type="radio"
                  checked={base64Mode === 'encode'}
                  onChange={() => setBase64Mode('encode')}
                />
                Encode
              </label>
              <label>
                <input
                  type="radio"
                  checked={base64Mode === 'decode'}
                  onChange={() => setBase64Mode('decode')}
                />
                Decode
              </label>
            </div>
            <button onClick={handleBase64}>{base64Mode === 'encode' ? 'Encode' : 'Decode'}</button>
            {base64Error && <div className="error">{base64Error}</div>}
            {base64Output && (
              <pre className="output-area">{base64Output}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
