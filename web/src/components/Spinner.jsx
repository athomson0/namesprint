import React from 'react'

const Spinner = () => {
    return (
        <div className="mt-8 flex justify-center items-center h-full">
            <div className="w-8 h-8 border-4 border-slate-600 rounded-full relative animate-spin">
                <div
                    className="absolute inset-0 rounded-full bg-teal-600"
                    style={{
                        clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
                    }}
                ></div>
            </div>
        </div>
    )
}

export default Spinner
