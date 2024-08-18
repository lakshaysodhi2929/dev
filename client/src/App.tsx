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
import OrderHistory from './components/OrderHistory/OrderHistory';
import AdminLogin  from './components/Admin/AdminLogin/AdminLogin';
import ProductList from './components/Admin/ProductList/ProductList';
import AddProduct from './components/Admin/AddProduct/AddProduct';

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
            path='/home'
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
          <Route 
            element={ <OrderHistory /> }
            path='/orders'
          />
          <Route 
            element={ <AdminLogin /> }
            path='/admin/login'
          />
          <Route 
            element={ <ProductList /> }
            path='/admin/productList'
          />
          <Route 
            element={ <AddProduct /> }
            path='/admin/addProduct'
          />
        </Routes>
      </BrowserRouter>
    </>
)


export default App
