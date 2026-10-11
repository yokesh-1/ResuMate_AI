import  { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import { useDispatch } from 'react-redux'
import api from './configs/api.js'
import { login ,setLoading } from './app/features/authSlice.js'
import {Toaster} from 'react-hot-toast' 


const App = () => {

  const dispatch = useDispatch()
  const getUserData = async () =>{
  const token =localStorage.getItem('token')

  try {
    if(token) {
      const{data} = await api.get('/api/users/data' , {headers :{ Authorization :`Bearer ${token}`}})

      if (data.user) {
        dispatch(login({token, user : data.user}))
      }
      dispatch(setLoading(false))

    } else {
      dispatch(setLoading(false))
    }
  } catch (error) {
     dispatch(setLoading(false))
     console.log(error.message)
  }

  }
 
  useEffect(  ()=> { 
    getUserData()  
   } ,[]
  ) ;

  return (
    <>
    <Toaster />
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
       
      </Routes>
    </>
  )
}

export default App