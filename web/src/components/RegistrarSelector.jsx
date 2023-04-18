import { useState, useEffect } from 'react'
import { getCurrencySymbol, generateToken, arrayBufferToHex } from '../util'
import { apiConversionUrl } from '../api'
import registrarInfo from '../data/registrarInfo.json'

function RegistrarSelector({ domain, closeFn }) {
    const [selected, setSelected] = useState(false)
    const [conversionToken, setConversionToken] = useState('')

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleCloseSelector()
            }
        }

        document.body.classList.add('overflow-hidden')
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.classList.remove('overflow-hidden')
        }
    }, [])

    useEffect(() => {
        async function loadConversionToken() {
            const token = await generateToken(domain.domain_name)
            setConversionToken(token)
        }

        if (domain) {
            loadConversionToken()
        }
    }, [domain])

    const handleCloseSelector = () => {
        setSelected(null)
        closeFn()
    }

    const generatePurchaseLink = (registrar) => {
        return `${apiConversionUrl}?domain_name=${domain.domain_name}&token=${conversionToken}&registrar=${registrar.name}&price=${registrar.price}&registrar_url=${registrar.url}`
    }

    const ModalContainer = ({ children }) => (
        <div
            className="fixed top-0 left-0 w-full h-full flex p-4 justify-center items-center bg-slate-900 bg-opacity-70 z-10"
            onClick={(event) =>
                event.target === event.currentTarget && handleCloseSelector()
            }
            style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'teal-800 slate-950',
                overflowY: 'scroll',
            }}
        >
            <div
                className="bg-slate-950 rounded-md pb-2 pb-6 px-6 border border-teal-900 shadow-md shadow-slate-950 max-h-[80%] overflow-y-auto my-4 md:my-auto"
                onClick={(event) => event.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )

    const ModalHeader = () => (
        <div className="sticky top-0 z-10 bg-slate-950">
            <div className="mb-6 p-2 pt-6 flex flex-row justify-between">
                <h2 className="text-2xl pb-2 font-medium text-white border-b border-teal-900">
                    {domain.domain_name}
                </h2>
                <button
                    className="text-slate-400 hover:text-slate-200 transition-colors h-fit text-2xl"
                    onClick={handleCloseSelector}
                >
                    ✖
                </button>
            </div>
        </div>
    )

    const ModalBody = () => (
        <div className="flex flex-col">
            <p className="text-white text-sm">
                This domain name is available at the following domain
                registrars.
                <br />
                <span className="font-semibold">Note:</span>{' '}
                {domain.show_price && (
                    <>Prices may not always be completely accurate.</>
                )}{' '}
                This list is not exhaustive.
            </p>
            {domain.purchase_links.map((registrar) => (
                <RegistrarEntry key={registrar.url} registrar={registrar} />
            ))}
        </div>
    )

    const RegistrarEntry = ({ registrar }) => (
        <div>
            <span className="flex flex-row my-10 w-2/3 border-b-2 border-b-slate-900 mx-auto"></span>
            <div>
                <div className="flex flex-row justify-between">
                    <p className="text-2xl sm:text-xl">
                        <a
                            className="text-teal-400 hover:text-teal-300 hover:cursor-pointer transition-colors font-bold"
                            href={generatePurchaseLink(registrar)}
                            target="blank"
                            rel="noopener noreferrer"
                        >
                            {registrar.name}
                        </a>{' '}
                        {domain.show_price && (
                            <>
                                for{' '}
                                <span className="italic font-extrabold">
                                    {getCurrencySymbol(registrar.currency)}
                                    {registrar.price}
                                    <span className="text-xs">/yr</span>
                                </span>
                            </>
                        )}
                    </p>
                    <img
                        className="fit max-h-10 max-w-16 mb-6"
                        src={registrarInfo[registrar.name].logo}
                    ></img>
                </div>
                <p className="max-w-lg text-sm mb-2">
                    {registrarInfo[registrar.name].blurb}
                </p>
                <ul>
                    {registrarInfo[registrar.name].features.map(
                        (feature, index) => (
                            <li className="text-xs pl-4 italic" key={index}>
                                - {feature}
                            </li>
                        )
                    )}
                </ul>
                <div className="flex justify-center">
                    <a
                        className="py-2 px-4 mt-8 text-sm cursor-pointer font-semibold hover:bg-teal-600  transition-all active:bg-teal-800 rounded rounded-md border-2 border-teal-600"
                        href={generatePurchaseLink(registrar)}
                        target="blank"
                        rel="noopener noreferrer"
                    >
                        Purchase at {registrar.name}
                    </a>
                </div>
            </div>
        </div>
    )

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full bg-slate-900 bg-opacity-70 backdrop-blur-md"></div>
            <ModalContainer>
                <ModalHeader />
                <ModalBody />
            </ModalContainer>
        </>
    )
}

export default RegistrarSelector
