<!-- Badges -->

[![Issues](https://img.shields.io/github/issues/bcgov-nr/action-gherkin-issue-processor)](/../../issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/bcgov-nr/action-gherkin-issue-processor)](/../../pulls)
[![Coverage](badges/coverage.svg)](/actions)
[![Apache 2.0 License](https://img.shields.io/github/license/bcgov-nr/action-gherkin-issue-processor.svg)](/LICENSE)
[![Lifecycle](https://img.shields.io/badge/Lifecycle-Experimental-339999)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)

<!-- Reference-Style link -->

[issues]:
  https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue
[pull requests]:
  https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/working-with-your-remote-repository-on-github-or-github-enterprise/creating-an-issue-or-pull-request

# Gherkin feature extractor from GitHub issues

GitHub Action that processes Gherkin content from issues and turn them into a
content that can be then saved into a file.

It reads the issues from a repository and extracts the Gherkin content from
them. The Gherkin content is then saved into a file. This expects the issue to
contains a Gherkin content in the body of the issue, like the following:

```gherkin
Feature: As a user, I want to be able to login to the system

  Scenario: User can login with valid credentials
    Given the user is on the login page
    When the user enters valid credentials
    Then the user is logged in
```

The action will extract the Gherkin content from the issue and provide it as a
parameter. You can then save as a **feature** file.

# Inputs

The only reaquired input is the `issue` number. All the other inputs are
optional and usually have default values.

- `issue` **(required)**: The github issue number, usually extracted from the
  event variable `${{ github.event.issue.number }}`
- `owner`: Target repository owner, default to the current repository owner
  `${{ github.repository_owner }}`
- `repo`: Target repository name including the owner, default to the current
  repository `${{ github.repository }}`
- `token`: GitHub token required to access the github api, default to
  `${{ github.token }}`
- `default_title`: Default title of the issue that should be replaced. This is
  to prevent duplicate naming of the issue
- `update_title`: Used in conjunction with `default_title` to update the title
  of the issue if it matches the `default_title`. It will replace the original
  title with
  `Automated test case #{issue number} opened by {user who opened the issue or 'unknown'}`

# Outputs

- `title`: The title of the issue. It can be the original one or the updated
- `sanitized_title`: The title of the issue in a clean and sanitized format that
  can be used as a file name
- `body`: The original body of the issue
- `feature`: The Gherkin content extracted from the issue. It is provided as an
  output so it can be saved into a file

# Usage

```yaml
- uses: bcgov-nr/action-gherkin-issue-processor@main
  with:
    ### Required

    # Issue number
    issue: 1

    # Target repository owner
    owner: bcgov-nr

    # Target repository name
    repo: bcgov-nr/action-gherkin-issue-processor
```

# Example, Current Repository

Runs when an issue is created. Extracts the Gherkin content from the issue and
saves it to a file.

```yaml
on:
  issues:
    types:
      - opened
jobs:
  feature:
    name: Extract feature content
    runs-on: ubuntu-latest
    steps:
      - name: Extract feature content
        id: feature
        uses: bcgov-nr/action-gherkin-issue-processor.yml@main
        with:
          issue: ${{ github.event.issue.number }}
      - name: Save feature content
        run: echo "${{ steps.feature.outputs.feature }}" > feature.feature
```

# Example, Current Repository but more verbose

Runs when an issue is created. Extracts the Gherkin content from the issue and
saves it to a file.

```yaml
on:
  issues:
    types:
      - opened
jobs:
  feature:
    name: Extract feature content
    runs-on: ubuntu-latest
    steps:
      - name: Extract feature content
        id: feature
        uses: bcgov-nr/action-gherkin-issue-processor.yml@main
        with:
          issue: ${{ github.event.issue.number }}
          owner: ${{ github.repository_owner }}
          repo: ${{ github.repository }}
      - name: Save feature content
        run: echo "${{ steps.feature.outputs.feature }}" > feature.feature
```

# Feedback

Please contribute your ideas! [Issues] and [pull requests] are appreciated.

<!-- # Acknowledgements

This Action is provided courtesty of the Forestry Digital Services, part of the Government of British Columbia. -->
