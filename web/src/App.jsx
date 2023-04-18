import React, { useState, useEffect } from 'react'
import SearchForm from './components/SearchForm'
import JobStatus from './components/JobStatus'
import Github from './icons/Github'
import QuestionMarkIcon from './icons/QuestionMarkIcon'
import './css/App.css'
import './css/bg-topography.css'

function App() {
    const [jobId, setJobId] = useState('')

    const handleSearch = (jobId) => {
        setJobId(jobId)
    }

    const center = !jobId ? 'items-center' : ''

    return (
        <div
            className={`bg-topography min-h-screen w-full text-white flex flex-col justify-between ${center}`}
        >
            <div className="container mx-auto my-auto px-4 py-8 pb-4">
                <nav
                    className="px-4 py-2 flex justify-center  flex-shrink-0 hover:cursor-pointer"
                    onClick={() => setJobId('')}
                >
                    <h1 className="text-5xl font-semibold py-3">name</h1>
                    <h1 className="text-5xl font-extrabold py-3 text-teal-500 italic">
                        sprint
                    </h1>
                </nav>
                <SearchForm onSearch={handleSearch} />
                {jobId && (
                    <JobStatus jobId={jobId} handleSearch={handleSearch} />
                )}
            </div>
            <div className="mt-auto flex justify-center py-6">
                <a href="https://github.com/athomson0/namesprint">
                    <Github className="h-6 w-6 fill-current text-gray-500 hover:text-gray-300 transition-colors" />
                </a>
                {/* <QuestionMarkIcon className="h-6 w-6 ml-2 text-gray-500 border-2 border-gray-500 hover:text-gray-300 hover:border-gray-300 transition-colors" /> */}
            </div>
        </div>
    )
}

export default App
