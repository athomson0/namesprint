import React from 'react'

const QuestionMarkIcon = ({ size = 10, className = '' }) => {
    const containerSize = `w-${size} h-${size}`
    const fontSize = `text-${Math.round(size * 0.6)}`

    return (
        <div
            className={`inline-flex justify-center items-center rounded-full cursor-pointer ${containerSize} ${className}`}
        >
            <span className={`font-bold ${fontSize}`}>?</span>
        </div>
    )
}

export default QuestionMarkIcon
