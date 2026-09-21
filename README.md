# BundleCheck Nx Testbed

[![BundleCheck CI](https://github.com/sonuKumar03/bundlecheck-nx-test/actions/workflows/bundlecheck.yml/badge.svg)](https://github.com/sonuKumar03/bundlecheck-nx-test/actions/workflows/bundlecheck.yml)

A multi-application Nx monorepo designed for end-to-end testing of [BundleCheck](https://github.com/sonuKumar03/bundlecheck) in CI/CD environments, specifically validating the GitHub Action, PR commenting, bundle budgets, and multi-project workspace analysis.

---

## Workspace Architecture

This repository models a real-world enterprise Angular monorepo built with Nx 22 and Angular 21 (esbuild application builder):

### Applications
- **`portal`** (`apps/portal`): Customer-facing web app using Angular Material, Chart.js, D3, and an eagerly routed PDF viewer (`pdfjs-dist`). Exercises tree-shaking suggestions, initial bundle budget warnings, and heavy third-party package tracing.
- **`admin-dashboard`** (`apps/admin-dashboard`): Internal administration dashboard utilizing ExcelJS and Moment.js. Tests CommonJS import attribution, bundle duplication detection, and lazy chunk analysis.

### Shared Libraries
- **`libs/shared-ui`**: Shared UI component library consumed across applications.
- **`libs/reporting`**: Shared analytics and reporting utilities.

---

## GitHub Actions Integration

The repository includes a GitHub Action workflow ([`.github/workflows/bundlecheck.yml`](.github/workflows/bundlecheck.yml)) demonstrating how to use `sonuKumar03/bundlecheck@master` with an Nx workspace:

```yaml
- name: BundleCheck - Portal
  uses: sonuKumar03/bundlecheck@master
  with:
    project: portal
    post-comment: ${{ github.event_name == 'pull_request' }}
    base-ref: ${{ github.base_ref || '' }}
    build-cmd: 'npm ci && npm run build:portal'
    output: bundle-report-portal.md

- name: BundleCheck - Admin Dashboard
  uses: sonuKumar03/bundlecheck@master
  with:
    project: admin-dashboard
    post-comment: false
    base-ref: ${{ github.base_ref || '' }}
    build-cmd: 'npm ci && npm run build:admin'
    output: bundle-report-admin.md
```

### What CI Validates:
1. **Multi-Project Auto-Discovery:** `bundlecheck` automatically resolves the correct `stats.json` and `dist` directories using `--project <name>`.
2. **Pull Request Reporting:** Automatically creates and updates Markdown summary tables as PR comments with size deltas, Gzip wire transfer estimates, and optimization suggestions.
3. **Budget Enforcement:** Verifies that initial and total JavaScript budgets fail gracefully if exceeded.
4. **Base-Ref Worktree Comparison:** When run on pull requests, captures the base branch in a git worktree to measure signed byte deltas.

---

## Local Development & Testing

### Prerequisites
- **Node.js**: `v20` or `v22` (LTS recommended)
- **npm**: `v10+`
- **BundleCheck CLI**: (Optional for local CLI testing)
  ```sh
  curl -fsSL https://raw.githubusercontent.com/sonuKumar03/bundlecheck/master/install.sh | sh
  ```

### Build Commands

```sh
# Install dependencies
npm ci

# Build both applications with production stats.json
npm run build

# Or build individual projects:
npm run build:portal
npm run build:admin
```

### BundleCheck Commands

Once built, inspect the bundle metrics with `bundlecheck`:

```sh
# Workspace overview across all apps
bundlecheck workspace summary --projects portal,admin-dashboard

# App summary with Gzip estimation & suggestions
bundlecheck summary -p portal --gzip --suggest

# Trace why a package is bundled into the initial chunk
bundlecheck why lodash -p portal --initial-only

# Check bundle budgets
bundlecheck check -p portal --max-initial 1MB --max-total 3MB
```
