# Claude Code Security Review Setup

This repository uses **Claude Code Security Review** - an AI-powered GitHub Action that analyzes pull requests for security vulnerabilities.

## What It Does

- ✓ Analyzes code diffs in every PR
- ✓ Detects security vulnerabilities using Claude's semantic understanding
- ✓ Posts findings directly as PR comments
- ✓ Supports any programming language
- ✓ Filters false positives intelligently
- ✓ Integrates with GitHub Actions

## Setup Instructions

### Step 1: Add Your Anthropic API Key

1. Go to your repository settings
2. Navigate to **Secrets and variables** → **Actions**
3. Create a new repository secret:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: Your Anthropic API key (get it from https://console.anthropic.com)

⚠️ **Important**: 
- Your API key must have Claude Code enabled
- Keep this key secret - it will only be available to GitHub Actions
- Never commit your API key to the repository

### Step 2: Verify Workflow File

The workflow file is already configured at `.github/workflows/security.yml`

Configuration:
- **Trigger**: Runs on every pull request (opened, synchronized, reopened)
- **Model**: Claude Opus 4.6 (latest and most capable)
- **Timeout**: 15 minutes per analysis
- **Excludes**: node_modules, dist, build, coverage, .next

### Step 3: Test It

1. Create a test PR with a code change
2. The action will automatically run
3. Security findings will appear as PR comments
4. Review the findings and merge when satisfied

## How It Works

### For Each PR:
```
1. PR submitted
   ↓
2. GitHub Action triggers
   ↓
3. Checks out code
   ↓
4. Claude analyzes diff
   ↓
5. Security findings extracted
   ↓
6. Comments posted on PR
   ↓
7. Results uploaded as artifact
```

### Example Finding
```
Security Review Comment on PR:

⚠️ Potential SQL Injection Vulnerability

File: src/database.ts, Line 42

The query is constructed using string concatenation without 
parameterized queries. This could allow SQL injection attacks.

Recommendation: Use parameterized queries or prepared statements.
```

## Configuration

Edit `.github/workflows/security.yml` to customize:

| Option | Value | Purpose |
|--------|-------|---------|
| `comment-pr` | true/false | Post comments on PRs |
| `claude-model` | Model ID | Which Claude model to use |
| `claudecode-timeout` | Minutes | Analysis timeout |
| `exclude-directories` | Comma-separated | Skip analyzing certain dirs |

### Recommended Models
- `claude-opus-4-6` - Latest, most capable (recommended)
- `claude-sonnet-4-6` - Faster, more economical
- `claude-haiku-4-5` - Fastest, for simple changes

## Security Considerations

⚠️ **WARNING**: This action analyzes code including:
- Your source code
- Dependencies and imports
- API credentials (if leaked in code)

**Safety measures**:
1. Only runs on PRs to your repository (not forks by default)
2. API key is kept secret
3. Results stored in artifacts (30-day retention)
4. Analysis is local to GitHub Actions

**Recommendations**:
- Enable branch protection rules
- Require approval for external contributors
- Review findings carefully before merging
- Never commit real API keys/passwords

## Monitoring & Results

### View Results
1. Go to PR → **Checks** tab
2. Expand "Claude Code Security Review" section
3. Review findings and recommendations

### Download Full Report
1. Go to **Actions** tab
2. Find the workflow run
3. Download "security-review-results" artifact

### Artifact Contents
```
security-review-[timestamp].json
{
  "pr_number": 123,
  "findings": [
    {
      "file": "src/api.ts",
      "line": 45,
      "severity": "high",
      "issue": "SQL Injection",
      "recommendation": "..."
    }
  ],
  "summary": {
    "total_issues": 2,
    "high_severity": 1,
    "medium_severity": 1,
    "low_severity": 0
  }
}
```

## Troubleshooting

### Action Not Running
- **Check**: PR is in your main repository (not a fork)
- **Check**: Workflow file is in `.github/workflows/`
- **Check**: ANTHROPIC_API_KEY is set in repository secrets

### No Comments on PR
- **Check**: The API key is valid and has Claude Code enabled
- **Check**: PR has actual code changes (not just doc changes)
- **Check**: Timeout wasn't exceeded (check logs)

### API Key Error
- **Solution**: Regenerate API key at https://console.anthropic.com
- **Verify**: Key has "Claude Code" enabled in your account
- **Update**: Re-add the key to GitHub secrets

### Too Many Findings
- **Solution**: Adjust `exclude-directories` to skip dependencies
- **Solution**: Use branch protection to require review
- **Solution**: Configure `claude-model` to claude-sonnet for faster filtering

## Cost

Security reviews are billed like normal Claude API usage:
- Input tokens: Lines of code analyzed
- Output tokens: Findings and explanations
- Typical PR: $0.01 - $0.05 per scan

Optimize costs:
- Exclude large dependency directories
- Use faster models for simple changes
- Review findings to catch issues early

## Integration with Ruflo

This security review integrates with your Ruflo setup:

**Auto-triggered by**:
- Code changes in PRs
- Commit patterns detected
- Repository activity

**Coordinates with**:
- `code-analyzer` agent (local analysis)
- `security-architect` agent (architecture review)
- `reviewer` agent (code quality)

**Memory integration**:
- Security patterns stored for future analysis
- Vulnerability types tracked over time
- Recommendations accumulated in knowledge base

## Example: Using with Code Review

```bash
# You create a PR with code changes
git push origin my-feature

# GitHub Actions automatically:
1. Checks code quality (local code-analyzer)
2. Runs security review (Claude Code Security Review)
3. Posts findings on PR
4. Stores patterns in Ruflo memory

# Results appear as PR comments with:
- Vulnerability details
- Risk severity
- Remediation steps
- Similar issues from history
```

## Resources

- **Repository**: https://github.com/anthropics/claude-code-security-review
- **Workflow File**: `.github/workflows/security.yml`
- **Anthropic Console**: https://console.anthropic.com
- **Ruflo Security**: `.claude/agents/consensus/security-manager.md`

## Next Steps

1. ✅ Workflow file created
2. ⏳ Add ANTHROPIC_API_KEY secret
3. ⏳ Create a test PR
4. ⏳ Review security findings
5. ⏳ Iterate and improve code

---

**Status**: Ready to use (pending API key configuration)

**Setup**: April 8, 2026
**Workflow**: `.github/workflows/security.yml`
**Integration**: Ruflo security agents
