import React from 'react'

const Container = ({ className , children }) => {
  return (
    <div className={`md:w-[800px] mx-auto py-10 ${className}`}>
        {children}
    </div>
  )
}

export default Container