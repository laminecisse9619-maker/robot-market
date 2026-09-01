import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CompareBar from './components/CompareBar'
import Home from './pages/Home'
import Robots from './pages/Robots'
import RobotDetail from './pages/RobotDetail'
import Cart from './pages/Cart'
import SellerSignup from './pages/SellerSignup'
import Sellers from './pages/Sellers'
import SellerStore from './pages/SellerStore'
import SellerDashboard from './pages/SellerDashboard'
import Compare from './pages/Compare'
import Messages from './pages/Messages'

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
          <Route path="/sell" element={<SellerSignup />} />
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/sellers/:slug" element={<SellerStore />} />
          <Route path="/dashboard" element={<SellerDashboard />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </main>
      <Footer />
      <CompareBar />
    </div>
  )
}

export default App
