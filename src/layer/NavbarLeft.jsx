import React from 'react'
import Container from './Container'
import { Link } from 'react-router-dom'

const NavbarLeft = () => {
  return (
    <div className='w-full '>
        <Container className={''}>
            <div className='w-[28.125%] '>
                <ul className='flex text-center'>
                    <li>
                        <Link className='text-lg font-bold text-blue-600 px-8 py-5 shadow-md' to='/'>Profile</Link>
                    </li>
                    <li>
                        <Link className='text-lg font-bold text-blue-600 px-8 py-5 shadow-md' to='/'>Customar</Link>
                    </li>
                    <li>
                        <Link className='text-lg font-bold text-blue-600 px-8 py-5 shadow-md' to='/'>Transaction</Link>
                    </li>
                    <li>
                        <Link className='text-lg font-bold text-blue-600 px-8 py-5 shadow-md' to='/'>Report</Link>
                    </li>
                </ul>
            </div>
        </Container>
    </div>
  )
}

export default NavbarLeft