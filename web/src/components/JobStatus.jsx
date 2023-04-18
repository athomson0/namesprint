import React, { useState, useEffect } from 'react'
import { fetchJobStatus, query } from '../api'
import DomainCardList from './DomainCardList'
import { groupDomains } from '../util'
import SuggestionCardList from './SuggestionCardList'
import Spinner from './Spinner'

function JobStatus({ jobId, handleSearch }) {
    const [jobStatus, setJobStatus] = useState(null)
    const [polling, setPolling] = useState(true)

    useEffect(() => {
        const fetchJob = async () => {
            try {
                if (!polling) return

                const data = await fetchJobStatus(jobId)

                if (data.status === 'finished') {
                    setPolling(false)
                    clearInterval(intervalId)
                }

                if (polling) {
                    setJobStatus({
                        ...data,
                        response_type:
                            data?.response_type ||
                            jobStatus?.response_type ||
                            'domain',
                    })
                }
            } catch (error) {
                console.error(error)
            }
        }

        const intervalId = setInterval(fetchJob, 500)
        const timeoutId = setTimeout(() => setPolling(false), 15000)
        return () => {
            clearInterval(intervalId)
            clearTimeout(timeoutId)
        }
    }, [jobId, polling])

    const handleSuggestionClick = async (suggestion, callback) => {
        try {
            const data = await query(suggestion, 'suggestion')
            callback(data.job_id)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        setJobStatus(null)
        setPolling(true)
    }, [jobId])

    if (!jobStatus) {
        return <Spinner />
    }

    const availableDomains = jobStatus.available_domains
    const unavailableDomains = jobStatus.unavailable_domains
    const unknownDomains = jobStatus.unknownDomains
    const suggestions = jobStatus.suggestions

    return (
        <div className="mt-8">
            {jobStatus.response_type === 'suggestion' ? (
                jobStatus.status != 'finished' ? (
                    <Spinner />
                ) : suggestions?.length > 0 ? (
                    <SuggestionCardList
                        suggestions={suggestions}
                        onSearch={(suggestion) =>
                            handleSuggestionClick(suggestion, handleSearch)
                        }
                    />
                ) : (
                    <h2>No suggestions found</h2>
                )
            ) : (
                <>
                    {availableDomains?.length > 0 ? (
                        <>
                            {Object.entries(groupDomains(availableDomains)).map(
                                ([groupName, domains]) =>
                                    domains.length > 0 && (
                                        <DomainCardList
                                            key={groupName}
                                            domains={domains}
                                            group={groupName}
                                            available
                                        />
                                    )
                            )}
                        </>
                    ) : (
                        <h2>No available domains</h2>
                    )}

                    {unavailableDomains?.length > 0 && (
                        <>
                            <DomainCardList
                                domains={unavailableDomains}
                                group="Unavailable"
                            />
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default JobStatus
