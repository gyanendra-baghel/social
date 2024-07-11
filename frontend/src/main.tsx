import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Chat from './pages/Chat.tsx'
import NotFound from './pages/NotFound.tsx'
import Logout from './pages/Logout.tsx'
import UserContextProvider from './context/UserContext.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import PrivateRoute from './utils/PrivateRoute.tsx'
import Explore from './pages/Explore.tsx'
import Profile from './pages/profile/index.tsx'
import EditProfile from './pages/profile/Edit.tsx'
import Feedback from './pages/Feedback.tsx'
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import { pageView } from './analytics.ts'

pageView();

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/feedback' element={<Feedback />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route path='explore' element={<Explore />} />
        <Route path='chat/:receiver?' element={<Chat />} />
        <Route path='profile' element={<Profile />} />
        <Route path='profile/edit/:type' element={<EditProfile />} />
        <Route path='logout' element={<Logout />} />
      </Route>
      <Route path="*" element={<NotFound />} errorElement={<NotFound />} />
    </>
  )
);
// console.log(import.meta.env.PROD)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </UserContextProvider>
  </React.StrictMode>,
)
