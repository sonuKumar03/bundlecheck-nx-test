# bundlecheck-nx-test

Testbed Nx monorepo for validating [BundleCheck](https://github.com/sonuKumar03/bundlecheck) GitHub Actions and multi-project analysis.

## Setup & Build

```sh
npm ci
npm run build
```

## Projects

- `portal`: Angular customer-facing application (`apps/portal`)
- `admin-dashboard`: Angular administration dashboard (`apps/admin-dashboard`)

## CI

Bundle checks run automatically on push and pull requests via [`.github/workflows/bundlecheck.yml`](.github/workflows/bundlecheck.yml).
