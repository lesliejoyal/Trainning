import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [newNumber, setNewNumber] = useState(true)
  const [memory, setMemory] = useState(0)
  const [history, setHistory] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [scientificMode, setScientificMode] = useState(true)

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') handleNumber(e.key)
      if (e.key === '.') handleDecimal()
      if (e.key === '+' || e.key === '-') handleOperator(e.key)
      if (e.key === '*') { e.preventDefault(); handleOperator('*') }
      if (e.key === '/') { e.preventDefault(); handleOperator('/') }
      if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calculate() }
      if (e.key === 'Backspace') handleBackspace()
      if (e.key === 'Escape') clearDisplay()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [display, previousValue, operation, newNumber])

  const handleNumber = (num) => {
    if (newNumber) {
      setDisplay(String(num))
      setNewNumber(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.')
      setNewNumber(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleOperator = (op) => {
    const currentValue = parseFloat(display)
    
    if (previousValue === null) {
      setPreviousValue(currentValue)
    } else if (operation) {
      const result = performCalculation(previousValue, currentValue, operation)
      setDisplay(String(result))
      setPreviousValue(result)
    }
    
    setOperation(op)
    setNewNumber(true)
  }

  const performCalculation = (prev, current, op) => {
    switch(op) {
      case '+': return prev + current
      case '-': return prev - current
      case '*': return prev * current
      case '/': return current === 0 ? 0 : prev / current
      default: return current
    }
  }

  const calculate = () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display)
      const result = performCalculation(previousValue, currentValue, operation)
      const calc = `${previousValue} ${operation} ${currentValue} = ${result}`
      setHistory([calc, ...history])
      setDisplay(String(result))
      setPreviousValue(null)
      setOperation(null)
      setNewNumber(true)
    }
  }

  const clearDisplay = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setNewNumber(true)
  }

  const handleBackspace = () => {
    if (!newNumber && display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else if (display.length === 1) {
      setDisplay('0')
      setNewNumber(true)
    }
  }

  const handlePercent = () => {
    const current = parseFloat(display)
    setDisplay(String(current / 100))
    setNewNumber(true)
  }

  const handleNegate = () => {
    setDisplay(String(parseFloat(display) * -1))
  }

  // Memory functions
  const memoryAdd = () => {
    setMemory(memory + parseFloat(display))
    setNewNumber(true)
  }

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display))
    setNewNumber(true)
  }

  const memoryRecall = () => {
    setDisplay(String(memory))
    setNewNumber(true)
  }

  const memoryClear = () => {
    setMemory(0)
  }

  // Scientific functions
  const handleScientific = (func) => {
    let result
    const current = parseFloat(display)
    
    switch(func) {
      case 'sqrt': result = Math.sqrt(current); break
      case 'square': result = current * current; break
      case 'cube': result = current * current * current; break
      case 'sin': result = Math.sin(current * Math.PI / 180); break
      case 'cos': result = Math.cos(current * Math.PI / 180); break
      case 'tan': result = Math.tan(current * Math.PI / 180); break
      case 'log': result = Math.log10(current); break
      case 'ln': result = Math.log(current); break
      case 'exp': result = Math.exp(current); break
      case 'factorial': result = factorial(Math.floor(current)); break
      case 'pi': result = Math.PI; break
      case 'e': result = Math.E; break
      default: result = current
    }
    
    setDisplay(String(result))
    setNewNumber(true)
  }

  const factorial = (n) => {
    if (n < 0) return NaN
    if (n === 0 || n === 1) return 1
    let result = 1
    for (let i = 2; i <= n; i++) result *= i
    return result
  }

  return (
    <div className={`calculator-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="calculator-wrapper">
        <div className="calculator-header">
          <h1>Advanced Calculator</h1>
          <button 
            className="theme-toggle" 
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="display-container">
          <div className="display">{display}</div>
          {memory !== 0 && <div className="memory-indicator">M: {memory.toFixed(2)}</div>}
        </div>

        <div className="calculator-content">
          <div className="main-calculator">
            {scientificMode && (
              <div className="scientific-section">
                <h3>Scientific</h3>
                <div className="scientific-buttons">
                  <button onClick={() => handleScientific('sqrt')}>√</button>
                  <button onClick={() => handleScientific('square')}>x²</button>
                  <button onClick={() => handleScientific('cube')}>x³</button>
                  <button onClick={() => handleScientific('factorial')}>n!</button>
                  <button onClick={() => handleScientific('sin')}>sin</button>
                  <button onClick={() => handleScientific('cos')}>cos</button>
                  <button onClick={() => handleScientific('tan')}>tan</button>
                  <button onClick={() => handleScientific('log')}>log</button>
                  <button onClick={() => handleScientific('ln')}>ln</button>
                  <button onClick={() => handleScientific('exp')}>eˣ</button>
                  <button onClick={() => handleScientific('pi')}>π</button>
                  <button onClick={() => handleScientific('e')}>e</button>
                </div>
              </div>
            )}

            <div className="memory-section">
              <h3>Memory</h3>
              <div className="memory-buttons">
                <button onClick={memoryAdd}>M+</button>
                <button onClick={memorySubtract}>M-</button>
                <button onClick={memoryRecall}>MR</button>
                <button onClick={memoryClear}>MC</button>
              </div>
            </div>

            <div className="basic-section">
              <h3>Basic</h3>
              <div className="buttons-grid">
                <button className="btn-function" onClick={clearDisplay}>C</button>
                <button className="btn-function" onClick={handleNegate}>±</button>
                <button className="btn-function" onClick={handlePercent}>%</button>
                <button className="btn-operator" onClick={() => handleOperator('/')}>/</button>

                <button className="btn-number" onClick={() => handleNumber('7')}>7</button>
                <button className="btn-number" onClick={() => handleNumber('8')}>8</button>
                <button className="btn-number" onClick={() => handleNumber('9')}>9</button>
                <button className="btn-operator" onClick={() => handleOperator('*')}>*</button>

                <button className="btn-number" onClick={() => handleNumber('4')}>4</button>
                <button className="btn-number" onClick={() => handleNumber('5')}>5</button>
                <button className="btn-number" onClick={() => handleNumber('6')}>6</button>
                <button className="btn-operator" onClick={() => handleOperator('-')}>-</button>

                <button className="btn-number" onClick={() => handleNumber('1')}>1</button>
                <button className="btn-number" onClick={() => handleNumber('2')}>2</button>
                <button className="btn-number" onClick={() => handleNumber('3')}>3</button>
                <button className="btn-operator" onClick={() => handleOperator('+')}>+</button>

                <button className="btn-number btn-zero" onClick={() => handleNumber('0')}>0</button>
                <button className="btn-number" onClick={handleDecimal}>.</button>
                <button className="btn-equals" onClick={calculate}>=</button>
              </div>
            </div>
          </div>

          <div className="history-section">
            <h3>History</h3>
            <button 
              className="clear-history-btn"
              onClick={() => setHistory([])}
            >
              Clear
            </button>
            <div className="history-list">
              {history.length === 0 ? (
                <p className="no-history">No calculations yet</p>
              ) : (
                history.map((calc, index) => (
                  <div key={index} className="history-item">
                    {calc}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="calculator-footer">
          <small>⌨️ Keyboard Support: Numbers, +, -, *, /, Enter for =, Backspace, Escape to clear</small>
        </div>
      </div>
    </div>
  )
}

export default App
