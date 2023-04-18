import React from 'react'
import SuggestionCard from './SuggestionCard'

function SuggestionCardList({ suggestions, onSearch }) {
    return (
        <>
            <h3 className="pb-4 pt-24 sm:w-auto sm:text-center font-extrabold border-b-4 mb-8 text-3xl border-b-teal-900">
                Suggested Names
            </h3>
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
                {suggestions.map((suggestion, index) => (
                    <SuggestionCard
                        key={index}
                        suggestion={suggestion}
                        onClick={onSearch}
                    />
                ))}
            </div>
        </>
    )
}

export default SuggestionCardList
