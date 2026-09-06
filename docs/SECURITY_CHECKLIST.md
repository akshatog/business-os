# Security Checklist — pos-platform

Run this against every change that touches auth, money, or stock before merging.

- [ ] Every data-touching route checks authentication and the required permission
- [ ] No raw SQL string concatenation — parameterized queries / Prisma only
- [ ] No secrets or API keys hardcoded — environment variables only
- [ ] All user input validated (via Zod) before use
- [ ] Passwords hashed with bcrypt, never stored in plaintext
- [ ] Stock and payment logic reviewed line-by-line, not just tested
- [ ] Rate limiting considered on any public-facing endpoint