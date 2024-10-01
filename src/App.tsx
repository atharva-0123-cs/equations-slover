import { Canvas } from './components/Canvas';
import { Toaster } from 'react-hot-toast';

// import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {

  return (
    <>
      <header>
        Eqation Solver
      </header>
      <Canvas />
      <Toaster
        toastOptions={{
          style: {
            background: '#0F0F0F',
            color: '#FFF',
            fontFamily: 'Itim',
            fontSize: '1.3rem',
            marginBottom: '20px',
            padding: '10px',
            lineHeight: '30px',
            width: document.body.clientWidth
          },
        }}
        position="bottom-center"
        reverseOrder={false}
      />
    </>
  )
}

export default App
