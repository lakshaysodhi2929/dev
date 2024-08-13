import './App.css'
import {
  BrowserRouter, Route, Routes
} from 'react-router-dom';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import Home from './components/Home/Home';
import CategoryItems from './components/CategoryItems/CategoryItems';
import Product from './components/Product/Product';
import Cart from './components/Cart/Cart';

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
          <Route 
            element={ <Home /> }
            path='/'
          />
          <Route 
            element={ <CategoryItems /> }
            path='/categoryItems/:category'
          />
          <Route 
            element={ <Product /> }
            path='/product/:productId'
          />
          <Route 
            element={ <Cart /> }
            path='/cart'
          />
        </Routes>
      </BrowserRouter>
    </>
)


export default App
