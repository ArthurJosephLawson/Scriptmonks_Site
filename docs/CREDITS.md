# Credits, Attributions & Third-Party Dependencies

This document provides full attribution for all third-party software, assets, and services used by the ScriptMønks website. Use this to satisfy attribution requirements and for legal/compliance review.

**Last updated:** 2026-10-27  
**Project:** scriptmonks (ScriptMønks)

## Core Framework & Runtime
| Dependency | Version | License | Purpose |
|---|---|---|---|
| [Next.js](https://nextjs.org/) | 16.4.2 | MIT | App Router framework, SSR/SSG, API routes |
| [React](https://react.dev/) | 19.3.0 | MIT | UI library |
| [React DOM](https://react.dev/) | 19.3.0 | MIT | React renderer |
| [TypeScript](https://www.typescriptlang.org/) | ^5 | Apache-2.0 | Type safety (strict mode) |

## Styling & UI
| Dependency | Version | License | Purpose |
|---|---|---|---|
| [Tailwind CSS](https://tailwindcss.com/) | ^3.4.19 | MIT | Utility-first CSS framework |
| [PostCSS](https://postcss.org/) | ^8.5.30 | MIT | CSS processing |
| [Autoprefixer](https://github.com/postcss/autoprefixer) | ^10.6.1 | MIT | Vendor prefixing |
| [class-variance-authority](https://cva.style/) | ^0.7.1 | Apache-2.0 | Component variant management |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | ^3.7.0 | MIT | Class merging utility |
| [clsx](https://github.com/lukeed/clsx) | ^2.1.1 | MIT | Conditional classnames |
| [lucide-react](https://lucide.dev/) | ^1.59.0 | ISC | Icon library |

## Forms, Validation & Animation
| Dependency | Version | License | Purpose |
|---|---|---|---|
| [react-hook-form](https://react-hook-form.com/) | ^7.90.0 | MIT | Form state management |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | ^5.9.2 | MIT | Validation resolvers |
| [zod](https://zod.dev/) | ^4.6.7 | MIT | Schema validation |
| [framer-motion](https://www.framer.com/motion/) | ^14.3.0 | MIT | Animations & transitions |
| [cmdk](https://cmdk.paco.me/) | ^1.1.1 | MIT | Command menu component |

## Backend & Services
| Dependency | Version | License | Purpose |
|---|---|---|---|
| [resend](https://resend.com/) | ^6.34.1 | MIT | Transactional email delivery (order/contact forms) |

## Development Tools
| Dependency | Version | License | Purpose |
|---|---|---|---|
| [eslint](https://eslint.org/) | ^9 | MIT | Linting |
| [eslint-config-next](https://nextjs.org/docs/app/api-reference/config/eslint) | 16.4.2 | MIT | Next.js ESLint config |
| [prettier](https://prettier.io/) | ^3.9.10 | MIT | Code formatting |
| [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) | ^0.8.1 | MIT | Tailwind class sorting |
| [vitest](https://vitest.dev/) | ^5.0.5 | MIT | Unit testing |
| [playwright](https://playwright.dev/) | ^1.64.1 | Apache-2.0 | E2E testing/browser automation |
| [sharp](https://sharp.pixelplumbing.com/) | ^0.35.5 | Apache-2.0 | Image optimization |

## Third-Party Services

| Service | Purpose | Data Processed | Privacy Policy |
|---|---|---|---|
| [Resend](https://resend.com/) | Sends order and contact form emails | Name, email, project details, GitHub username (optional), company (optional), messages/links | [Resend Privacy Policy](https://resend.com/legal/privacy-policy) |

**Important:** Resend API keys are server-side only. No form data is sent to client-side third-party services. All email delivery happens server-side via Next.js API routes.

## Assets & Fonts
- **Fonts:** System fonts are used where possible. Any web fonts follow their respective licenses.
- **Icons:** Lucide React icons (ISC License)
- **Images/Logos:** Created by ScriptMønks. See `public/brand/` for brand assets.

## License Compliance
All dependencies use permissive licenses (MIT, Apache-2.0, ISC). No GPL/AGPL dependencies are used. This project itself is proprietary software owned by ScriptMønks.

## Attribution Notes
If you redistribute or modify this software, ensure you comply with all license terms of the dependencies listed above. This document is provided for transparency and compliance purposes.
