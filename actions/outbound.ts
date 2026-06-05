"use server"

export const launchOutbound = async (accountId: string, flowId: string, outboundId: string, phoneNumber: string, name: string) => {
  try {
    const API_URL = "https://api.connect.truorastaging.com/v1/whatsapp/outbounds/send"
    
    const urlencoded = new URLSearchParams()

    urlencoded.append("country_code", "+57")
    urlencoded.append("account_id", accountId)
    urlencoded.append("phone_number", phoneNumber)
    urlencoded.append("outbound_id", outboundId)
    urlencoded.append("flow_id", flowId)
    urlencoded.append("user_authorized", "true")
    urlencoded.append("var.name", name)

    const response = await fetch(API_URL, {
      method: "POST",
      body: urlencoded,
      headers: {
        "Truora-API-Key": process.env.TRUORA_API_KEY || "",
      }
    })

    if (!response.ok) {
      console.error("Failed to launch outbound", await response.text())
    }

    const data = await response.json()

    return data
  } catch (error) {
    console.error("Failed to launch outbound", error)
    return null
  }
}
