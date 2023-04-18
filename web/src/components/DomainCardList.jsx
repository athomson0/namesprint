import DomainCard from './DomainCard'
import TwinkleEmoji from '../icons/TwinkleEmoji'

function DomainCardList({ domains, available, group }) {
    const headerCss = available
        ? 'text-4xl border-b-teal-900'
        : 'text-3xl border-b-rose-900'

    if (
        domains.every(
            (domain) =>
                !domain.purchase_links || domain.purchase_links.length === 0
        )
    ) {
        return null
    }

    return (
        <>
            <h3
                className={`pb-4 pt-24 md:w-fit sm:w-auto sm:text-center font-extrabold border-b-4 mb-8 ${headerCss}`}
            >
                {group == 'DomainHack' ? (
                    <>
                        <TwinkleEmoji className="inline-block text-yellow-300 pr-2" />
                        Domain hack found!
                        <TwinkleEmoji className="inline-block text-yellow-300 pl-2" />
                    </>
                ) : (
                    <>{group} domains</>
                )}
            </h3>
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4  gap-6">
                {domains.map((domain, index) => (
                    <DomainCard
                        key={index}
                        domain={domain}
                        available={available}
                        unavailable={!available}
                    />
                ))}
            </div>
        </>
    )
}

export default DomainCardList
