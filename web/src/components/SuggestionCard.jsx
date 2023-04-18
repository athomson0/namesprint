import React from 'react'

function SuggestionCard({ suggestion, onClick }) {
    return (
        <div className="h-full rounded-lg bg-slate-800 transform transition-all duration-150 hover:scale-105 hover:shadow-lg">
            <div className="flex justify-between h-full">
                <h4 className="text-lg text-slate-100 font-bold p-3 my-0.5 cursor-default">
                    {suggestion}
                </h4>
                <div
                    className="flex items-center bg-teal-700 hover:bg-teal-600 transition-colors h-full rounded-r-lg px-3 cursor-pointer"
                    onClick={() => onClick(suggestion)}
                >
                    <p className="text-lg italic font-bold text-white mr-3 whitespace-nowrap">
                        SEARCH
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SuggestionCard
