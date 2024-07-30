import './App.css'
import {
  BrowserRouter, Route, Routes
} from 'react-router-dom';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';

export const App = () => (
    <>
      <BrowserRouter>
        <Routes>
          <Route 
            element={ <SignUp /> }
            path='/signUp'
          />
          <Route 
            element={ <SignIn /> }
            path='/signIn'
          />
        </Routes>
      </BrowserRouter>
    </>
)


export default App
