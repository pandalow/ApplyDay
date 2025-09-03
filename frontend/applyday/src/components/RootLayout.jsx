import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'
import Footer from './Footer'

function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout
