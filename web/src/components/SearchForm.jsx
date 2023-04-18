import React, { useState, useEffect } from 'react'
import { query } from '../api'

function SearchForm({ onSearch }) {
    const [domain, setDomain] = useState('')
    const [searchInProgress, setSearchInProgress] = useState(false)
    const [showErrorCard, setShowErrorCard] = useState(false)
    const [placeholderText, setPlaceholderText] = useState('')

    const handleSubmit = async (event, searchType = 'domain') => {
        event.preventDefault()
        try {
            setSearchInProgress(true)
            const data = await query(domain, searchType)
            onSearch(data.job_id)
        } catch (error) {
            setShowErrorCard(true)
        } finally {
            setSearchInProgress(false)
        }
    }

    useEffect(() => {
        let errorCardTimeout
        if (showErrorCard) {
            errorCardTimeout = setTimeout(() => {
                setShowErrorCard(false)
            }, 7500)
        }

        return () => {
            clearTimeout(errorCardTimeout)
        }
    }, [showErrorCard])

    const placeholders = [
        'awesome-domain-idea',
        'suggest a name for my ... company',
    ]

    useEffect(() => {
        let currentPlaceholderIndex = 0
        let textIndex = 0
        let typingTimeout
        let backspaceTimeout

        const type = () => {
            setPlaceholderText(
                placeholders[currentPlaceholderIndex].substring(
                    0,
                    textIndex + 1
                )
            )
            textIndex++

            if (textIndex <= placeholders[currentPlaceholderIndex].length) {
                typingTimeout = setTimeout(type, 75)
            } else {
                backspaceTimeout = setTimeout(backspace, 2000)
            }
        }

        const backspace = () => {
            setPlaceholderText(
                placeholders[currentPlaceholderIndex].substring(
                    0,
                    textIndex - 1
                )
            )
            textIndex--

            if (textIndex >= 0) {
                backspaceTimeout = setTimeout(backspace, 75)
            } else {
                currentPlaceholderIndex =
                    (currentPlaceholderIndex + 1) % placeholders.length
                typingTimeout = setTimeout(type, 500)
            }
        }

        type()

        return () => {
            clearTimeout(typingTimeout)
            clearTimeout(backspaceTimeout)
        }
    }, [])

    const ErrorCard = () => {
        return (
            <>
                <div className="flex justify-center mt-8 p-6 bg-rose-900 mx-auto w-fit rounded-lg text-gray-100">
                    There was an error fetching from the API.
                </div>
            </>
        )
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="mt-8">
                <div className="flex items-center justify-center mb-4">
                    <div className="relative inline-flex items-center border-slate-400 shadow-md shadow-black">
                        <input
                            id="domain"
                            type="text"
                            value={domain}
                            onChange={(event) => setDomain(event.target.value)}
                            className="rounded-l-2xl text-gray-800 px-6 py-2 focus:outline-none placeholder-gray-500"
                            placeholder={placeholderText}
                        />
                        <button
                            type="submit"
                            onClick={(event) =>
                                handleSubmit(event, 'suggestion')
                            }
                            className={
                                'rounded-r-2xl bg-teal-700 hover:bg-teal-900 active:bg-teal-950 text-white font-bold px-4 py-2 rounded transition-colors duration-100'
                            }
                        >
                            Search
                        </button>
                        <span
                            className="absolute inset-0 rounded-2xl pointer-events-none shadow-md shadow-slate-900"
                            tabIndex={-1}
                        ></span>
                    </div>
                </div>
            </form>
            {showErrorCard && <ErrorCard />}
        </>
    )
}

export default SearchForm
