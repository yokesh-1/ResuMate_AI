import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
const App = () => {
  return (
    <>
      <Routes>
       <Route path='/' element={<Home />} />  
       {/*  NESTED ROUTES
          PARENT ROUTE (Layout): 
          Any URL starting with '/app' renders the Layout component.
          The Layout acts as a persistent frame (like a navbar/sidebar) containing an <Outlet />.
        */}
       <Route path='app' element={<Layout />}>
       {/* Dashboard element is rendered as  the default child route inside Layout */}
       <Route index element={<Dashboard />} />
       {/* matches URLs like `/app/builder/abc-123`. It swaps out the dashboard and renders the `ResumeBuilder`
        component inside the same `Layout`, capturing the dynamic `resumeId` parameter. */}
       <Route path='builder/:resumeId' element={<ResumeBuilder />} />
       </Route>
       <Route path='view/:resumeId' element={<Preview />} />
       <Route path ='login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App