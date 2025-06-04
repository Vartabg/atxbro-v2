# Atxbro Platform

This repository hosts the main **Next.js** application used for experimental
visualizations and tools. A secondary project exists in the
`atxbro-solutions-hub` directory which provides a minimal sandbox for testing
new ideas. Both projects are based on Next.js.

## Getting Started

### Prerequisites

Ensure you have **Node.js 18+** installed along with `npm` (or your preferred
package manager).

Install dependencies:

```bash
npm install
```

### Running the Development Server

Start the Next.js dev server at [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

You can also use `yarn dev`, `pnpm dev`, or `bun dev` if those managers are
available.

### Building for Production

Create an optimized production build:

```bash
npm run build
npm start
```

### 3D Planetary View

When the dev server is running, navigating to
[http://localhost:3000](http://localhost:3000) automatically loads the 3D
planetary interface. From this view you can orbit around the planets and select
one of the available services.

### Launching VetNav

Inside the planetary interface choose the **VetNav** service to open the veteran
benefits navigator. VetNav provides search and filter tools to explore federal
and state benefits.

## `atxbro-solutions-hub`

The repository also includes a secondary Next.js project located in the
`atxbro-solutions-hub` folder. It follows the same setup procedure:

```bash
cd atxbro-solutions-hub
npm install
npm run dev
```

Use this project for quick experiments and prototype features independent of the
main application.

## Running Tests

Execute the test suite with:

```bash
npm test
```

The project uses Jest with React Testing Library. Ensure dependencies are
installed before running the tests.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
