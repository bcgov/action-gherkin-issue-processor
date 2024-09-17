<!-- Badges -->

[![Issues](https://img.shields.io/github/issues/bcgov-nr/action-gherkin-issue-processor)](/../../issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/bcgov-nr/action-gherkin-issue-processor)](/../../pulls)
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
