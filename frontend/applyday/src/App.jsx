import {createBrowserRouter} from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import './App.css'
import RootLayout from './components/RootLayout'
import Home from "./pages/Home"
import ApplicationManager from './pages/Application'
import ExtractManager from './pages/ExtractManager'
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
        path:"/extract",
        element:<ExtractManager/>
      },
      {
        path:"/report",
        element:<Report/>
      }

    ]
  }
])

function App(){
  return <RouterProvider router={router}/>
}

export default App