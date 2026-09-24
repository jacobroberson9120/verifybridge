# VerifyBridge privacy

VerifyBridge is designed to minimize data collection. It does not require an account and does not include advertising, analytics, tracking pixels, or third-party fonts.

## Message checks

Message text is analyzed inside the browser. VerifyBridge does not upload, store, or report the message. The checked-in detection rules and model run locally on the device.

## Link checks

Link Lens first checks the address structure locally without opening the destination. If the user explicitly chooses **Check live reputation**, the submitted URL is sent to the VerifyBridge API and then to Google Web Risk. Message text, names, passwords, and account contents are not included. The API response is not cached by VerifyBridge.

## Optional local summary

The private safety summary is disabled by default. If enabled, it stores only weekly check totals and high-risk-result totals in that browser's local storage. It does not store messages, links, names, findings, or browsing history. The user can clear or export these totals at any time.

## Chrome extension

The extension does not monitor an inbox or scan messages automatically. It uses Chrome's `activeTab` and `scripting` permissions only after the user opens the extension and starts a check. For Gmail and Outlook message checks, it reads only text the user has highlighted in the active tab. That selected text is analyzed locally and is not saved or transmitted. The page-link check reads only the active page URL after the user requests the check.

## Ordinary hosting data

Cloudflare may process ordinary web-request information, such as IP addresses and request metadata, to deliver and protect the site. External resources from USCIS, the FTC, CISA, and the FBI open only when the user selects their links and are governed by those sites' policies.

## Project scope

VerifyBridge is a screening and education prototype, not a verdict, identity-verification service, legal service, or emergency-reporting system.
