# Screen: Onboarding

## Purpose
Captured immediately after an owner registers a new business, before they can access the rest of the app. Collects the actual business details and, critically, the business type — which determines which vertical module activates for this business going forward.

## Data it needs

**Business (being completed)**
```
{ id, name, businessType, address, gstNumber, phone, email, onboardingCompleted }
```

## Actions

- Select business type (dropdown/cards) — only `pharmacy` is a real, working option right now (per the current roadmap); other types can be shown as "coming soon" rather than hidden, so the intended future shape of the product is visible, without letting a business actually select an unbuilt module
- Enter business address, GST number, phone, email
- Submit — calls a business-update action that sets these fields and marks `onboardingCompleted: true`

## States

- In progress (form partially filled)
- Validation error (e.g. missing required field)
- Submitting
- Complete — redirects into the app proper (Dashboard)

## Explicitly NOT this screen's job
- Creating the account itself — that already happened at registration (`register-business`)
- Adding products, staff, or any other setup — those happen inside the app after onboarding, not as part of this flow
- Accessible to anyone but the business's `owner` — a cashier or manager should never see this screen

## Access rule
The app checks `business.onboardingCompleted` after login. If false, the owner is routed here instead of the Dashboard, regardless of what URL/screen they were trying to reach. Non-owner roles should never encounter this screen — an incomplete business shouldn't realistically have staff yet, but the check exists as a safeguard.