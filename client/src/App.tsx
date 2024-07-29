import './App.css'
import {
  BrowserRouter, Route, Routes
} from 'react-router-dom';
import SignUp from './components/SignUp';

export const App = () => (
    <>
      <BrowserRouter>
        <Routes>
          <Route 
            element={ <SignUp /> }
            path='/signUp'
          />
        </Routes>
      </BrowserRouter>
    </>
)


export default App
