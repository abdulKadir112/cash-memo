import React from 'react'
import { Outlet } from 'react-router-dom'
import MenuBar from './layer/MenuBar'
// import NavbarRight from './layer/NavvarRight'

const RootLayOut = () => {
  return (
    <div className=" h-screen w-full">
        <MenuBar/>
        <Outlet/>
      {/* <NavbarRight/> */}
    </div>
  )
}

export default RootLayOut