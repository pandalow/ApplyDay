import {createBrowserRouter} from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import './App.css'
import RootLayout from './components/RootLayout'
import Home from "./pages/Home"
import ApplicationManager from './pages/Application'
import DataManagement from './pages/Data'
import Report from './pages/Report'

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
        path: "/app", 
        element: <ApplicationManager/>
      },

      {
        path:"/report",
        element:<Report/>
      },
      {
        path:"/extract",
        element:<DataManagement/>
      },
    ]
  }
])

function App(){
  return <RouterProvider router={router}/>
}

export default App