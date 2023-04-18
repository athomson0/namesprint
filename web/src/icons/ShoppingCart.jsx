function ShoppingCart({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M4 4h16l-1.58 7.9a2 2 0 0 1 -1.9 1.7h-10a2 2 0 0 1 -1.9 -1.4l-1.7 -5.1a1 1 0 0 1 0 -.6l2-3a1 1 0 0 1 1 -.4z" />
        </svg>
    )
}

export default ShoppingCart
