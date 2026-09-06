# Product Requirements — pos-platform (working name)

## What this is
A business management platform for offline businesses in India, with POS (billing) at its center. Not a billing-only app — the goal is for an owner to run inventory, billing, invoices, and the broader operation of their business from one system.

## Why
Offline businesses have different operational needs depending on their type (a pharmacy needs batch/expiry/prescription tracking; a clothing store needs size/color variants; a grocery store needs fast barcode billing and weight-based pricing). This product aims to be one platform with a shared core, and modules that adapt it to each vertical, rather than a separate app per business type.

## Who it's for
Offline business owners who want a single reliable system to run their business — starting with pharmacy/medical stores.

## First vertical: Pharmacy
Validated via a real medical store contact who expressed interest in the product and offered to refer additional clients.

## Platform requirements
- Desktop app (primary usage) and mobile app (secondary, for monitoring/management)
- Production-grade reliability — data must never be lost or corrupted due to a bug
- Support for importing existing business data
- Not locked to one vertical's feature set — modules are selected per business type

## Long-term shape
Core platform (billing, inventory, customers, suppliers, payments, reports) + vertical modules (pharmacy first, others later).