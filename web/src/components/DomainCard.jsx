import { useState } from 'react'
import ShoppingCart from '../icons/ShoppingCart'
import RegistrarSelector from './RegistrarSelector'
import { getCurrencySymbol } from '../util'

function DomainCard({ domain, available }) {
    const [showRegistrarSelector, setShowRegistrarSelector] = useState(false)

    const borderClass =
        available && !domain.is_domain_hack
            ? 'border-b-2 border-dashed border-b-teal-700'
            : 'shadow-md shadow-black'

    const domainFontSize =
        domain.domain_name.length > 24
            ? 'text-xs'
            : domain.domain_name.length > 22
            ? 'text-sm'
            : domain.domain_name.length > 18
            ? 'text-md'
            : 'text-lg'

    const priceFontSize =
        domain.cheapest_price?.length >= 4 ? 'text-md' : 'text-lg'

    const handleBuyClick = () => {
        setShowRegistrarSelector(true)
    }

    if (!domain.purchase_links.length) {
        return null
    }

    return (
        <div className>
            <div
                className={`h-full b rounded-lg bg-slate-800 transform transition-all duration-150 hover:scale-105 hover:shadow-lg`}
            >
                <div
                    className={`flex rounded-lg justify-between h-full ${borderClass}`}
                >
                    <h4
                        className={`${domainFontSize} p-3 text-slate-100 font-bold my-0.5 cursor-default whitespace-nowrap overflow-hidden`}
                    >
                        {domain.domain_name}
                    </h4>

                    {available && (
                        <>
                            <div
                                className="flex items-center bg-teal-700 hover:bg-teal-600 transition-colors h-full rounded-r-lg px-3 hover:cursor-pointer"
                                onClick={handleBuyClick}
                            >
                                <p
                                    className={`text-lg italic font-bold text-white mr-3 whitespace-nowrap`}
                                >
                                    {domain.show_price ? (
                                        <>
                                            {getCurrencySymbol(domain.currency)}
                                            {domain.cheapest_price}
                                            <span className="text-xs">/yr</span>
                                        </>
                                    ) : (
                                        <>BUY</>
                                    )}
                                </p>
                                <ShoppingCart
                                    className={
                                        'h-6 w-6 text-teal-100 fill-teal-100'
                                    }
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
            {showRegistrarSelector && (
                <RegistrarSelector
                    domain={domain}
                    closeFn={() =>
                        setShowRegistrarSelector(!showRegistrarSelector)
                    }
                />
            )}
        </div>
    )
}

export default DomainCard
