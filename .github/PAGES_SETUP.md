# GitHub Pages Setup for Lessons

This repository includes a GitHub Actions workflow to automatically deploy the lessons site to GitHub Pages.

## Setup Steps

### 1. Enable GitHub Pages in Repository Settings

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select:
   - Source: **GitHub Actions** (recommended)
   - Or Source: **Deploy from a branch** → Branch: `main` → Folder: `/lessons`

### 2. Verify Workflow Permissions

1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Ensure **Read and write permissions** is selected
4. Check **Allow GitHub Actions to create and approve pull requests**

### 3. Trigger Deployment

The workflow (`.github/workflows/pages.yml`) will automatically deploy when:
- Changes are pushed to the `main` branch in the `lessons/` directory
- You manually trigger it via **Actions** tab → **Deploy Lessons to GitHub Pages** → **Run workflow**

### 4. Access Your Site

After successful deployment, your lessons will be available at:

**Public repositories:**
```
https://<username>.github.io/<repository-name>/
```

Example:
```
https://ivan.github.io/workspace-notes/01-mmlu-what-makes-a-benchmark/
```

**Private repositories:**
GitHub Pages on private repos requires a GitHub Pro, Team, or Enterprise account. If unavailable, use local serving (see below).

## Local Development

### Serve Locally

```bash
# Option 1: Python
cd lessons/01-mmlu-what-makes-a-benchmark/
python -m http.server 8000
# Visit http://localhost:8000

# Option 2: Node.js
npx serve lessons/01-mmlu-what-makes-a-benchmark/
# Visit http://localhost:3000

# Option 3: PHP
cd lessons/01-mmlu-what-makes-a-benchmark/
php -S localhost:8000
```

### Direct File Access

You can also open `lessons/01-mmlu-what-makes-a-benchmark/index.html` directly in a browser. Most features work without a server, though relative links may behave differently.

## Troubleshooting

### Pages Not Deploying

1. Check the **Actions** tab for workflow run status
2. Verify the workflow file exists: `.github/workflows/pages.yml`
3. Ensure GitHub Pages is enabled in repository settings
4. For private repos, verify your account has Pages access

### 404 Errors

1. Check the base URL matches your repository name
2. Verify the `lessons/` directory is in the `main` branch
3. Wait a few minutes after the first deployment

### Workflow Permissions Error

1. Go to **Settings** → **Actions** → **General**
2. Enable **Read and write permissions**
3. Re-run the workflow

## Alternative: Branch-Based Deployment

If you prefer not to use GitHub Actions:

1. Go to **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** (or your preferred branch)
4. Folder: **/lessons** or **/root** (depending on structure)
5. Click **Save**

Your site will be available at the same URL structure.

## Updating Content

After pushing changes to `lessons/`:
1. The workflow automatically rebuilds and deploys
2. Changes appear within 1-2 minutes
3. Hard refresh your browser (`Ctrl+Shift+R` or `Cmd+Shift+R`) to see updates
