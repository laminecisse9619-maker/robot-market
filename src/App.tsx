import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CompareBar from './components/CompareBar'
import RequireAuth from './components/RequireAuth'
import Home from './pages/Home'
import Robots from './pages/Robots'
import RobotDetail from './pages/RobotDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess'
import SellerSignup from './pages/SellerSignup'
import Sellers from './pages/Sellers'
import SellerStore from './pages/SellerStore'
import SellerDashboard from './pages/SellerDashboard'
import Compare from './pages/Compare'
import Messages from './pages/Messages'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/robots" element={<Robots />} />
          <Route path="/robots/:slug" element={<RobotDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/sell" element={<RequireAuth><SellerSignup /></RequireAuth>} />
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/sellers/:slug" element={<SellerStore />} />
          <Route path="/dashboard" element={<RequireAuth><SellerDashboard /></RequireAuth>} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <Footer />
      <CompareBar />
    </div>
  )
}

export default App
