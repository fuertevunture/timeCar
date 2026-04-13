import './App.css'
import {RouterProvider} from 'react-router-dom'
import router from "@/route/router.tsx";






function App() {
  return (
    <div className="app">
        <RouterProvider router={router}></RouterProvider>
    </div>
  )
}

export default App
