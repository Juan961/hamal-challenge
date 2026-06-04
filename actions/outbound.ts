export const launchOutbound = async (phoneNumber: string) => {
  try {
    const API_URL = "/v1/whatsapp/outbounds/send"
    
    const urlencoded = new URLSearchParams()

    const accountId = "70dfnoo9mn2lf052manim57cvg"
    const flowId = "IPFaa962d8099dc437f3c1d95a21556df20"
    const outboundId = ""

    urlencoded.append("country_code ", "+57")
    urlencoded.append("account_id", accountId)
    urlencoded.append("phone_number", phoneNumber)
    urlencoded.append("outbound_id ", outboundId)
    urlencoded.append("flow_id", flowId)

    const response = await fetch(API_URL, {
      method: "POST",
      body: urlencoded,
    })

    if (!response.ok) {
      console.error("Failed to launch outbound")
    }

    const data = await response.json()

    return data
  } catch (error) {
    console.error("Failed to launch outbound", error)
    return null
  }
}
