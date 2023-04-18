export const getCurrencySymbol = (currencyCode) => {
    switch (currencyCode) {
      case "USD":
        return "$";
      case "GBP":
        return "£";
      case "EUR":
        return "€";
      case "JPY":
        return "¥";
      default:
        return currencyCode;
    }
  }

export const groupDomains = (domains) => {
  const groups = {
      DomainHack: [],
      Premium: [],
      Common: [],
      Other: [],
  }

  domains.forEach((domain) => {
      if (!domain.purchase_links.length) {
          return
      } else if (domain.is_domain_hack) {
          groups['DomainHack'].push(domain)
      } else if (domain.priority >= 1 && domain.priority < 2) {
          groups['Premium'].push(domain)
      } else if (domain.priority >= 2 && domain.priority < 3) {
          groups['Common'].push(domain)
      } else {
          groups['Other'].push(domain)
      }
  })

  return groups
}

export const arrayBufferToHex = (buffer) => {
  const byteArray = new Uint8Array(buffer)
  const hexCodes = [...byteArray].map((value) => {
      const hexCode = value.toString(16)
      return hexCode.padStart(2, '0')
  })

  return hexCodes.join('')
}

export const generateToken = async (data) => {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  return arrayBufferToHex(hashBuffer)
}
