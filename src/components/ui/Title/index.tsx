import React from 'react'
import cn from 'classnames'

interface TitleProps {
    title: string
    subtitle?: string
    className?: string

}

const Title = ({ title, subtitle, className }: TitleProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
        <h1 className='text-3xl font-bold'>{title}</h1>
        {subtitle && <p className='text-sm text-gray-500'>{subtitle}</p>}
    </div>
  )
}

export default Title