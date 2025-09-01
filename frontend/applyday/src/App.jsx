import {createBrowserRouter} from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import './App.css'
import RootLayout from './components/RootLayout'
import Home from './components/Home'
import AdminPanel from './components/AdminPanel'

const router = createBrowserRouter([
  {
    path: "/", 
    element: <RootLayout />,
    children: [
      {
        path: "/", 
        element: <Home />
      },
      {
        path: "/admin", 
        element: <AdminPanel />
      }
    ]
  }
])

function App(){
  return <RouterProvider router={router}/>
}

export default App