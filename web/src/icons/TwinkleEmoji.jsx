import React from 'react'

function TwinkleEmoji(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="40px"
            height="40px"
            {...props}
        >
            <path d="M12 2.3c-5.4 0-9.7 4.3-9.7 9.7s4.3 9.7 9.7 9.7 9.7-4.3 9.7-9.7-4.3-9.7-9.7-9.7zm0 17.9c-4.5 0-8.1-3.6-8.1-8.1s3.6-8.1 8.1-8.1 8.1 3.6 8.1 8.1-3.6 8.1-8.1 8.1z" />
            <path d="M12 5.2l2.2 4.5 5 .2-3.8 3.1 1.1 5-4.5-2.5-4.5 2.5 1.1-5-3.8-3.1 5-.2z" />
        </svg>
    )
}

export default TwinkleEmoji
