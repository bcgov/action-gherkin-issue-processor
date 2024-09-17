import * as core from "@actions/core";
import { Octokit } from "@octokit/rest";
import MarkdownIt from "markdown-it";

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  const token = core.getInput("token", { required: true });

  if (!token) {
    core.setFailed("GitHub token is required.");
  }

  // Initialize the GitHub client with the token
  const octokit = new Octokit({ auth: token });
  // GitHub repository information
  const owner = core.getInput("owner", { required: true });
  const repo = core.getInput("repo", { required: true });
  // Issue number to extract Gherkin content from
  const issueNumber = parseInt(core.getInput("issue", { required: true }));

  // Default values
  const defaultTitle = core.getInput("default_title") || "Test";
  const updateTitle = core.getBooleanInput("update_title") || false;

  core.info(
    `Extracting Gherkin content from issue #${issueNumber} in ${owner}/${repo}...`,
  );

  if (
    !owner ||
    !repo ||
    !issueNumber ||
    isNaN(issueNumber) ||
    issueNumber <= 0
  ) {
    core.setFailed("Owner, repo, and issue number are required inputs.");
  }

  const parsedRepo = repo.replace(owner + "/", "");

  try {
    // Fetch the issue data from GitHub
    const { data: issue } = await octokit.issues.get({
      owner,
      repo: parsedRepo,
      issue_number: issueNumber,
    });

    const issueBody = issue.body || "";
    let updatedTitle = issue.title;

    // Parse the markdown content
    const md = new MarkdownIt();
    const tokens = md.parse(issueBody, {});
    let gherkinText = "";

    // Look for the Gherkin code block
    tokens.forEach((token: any) => {
      if (token.type === "fence" && token.info === "gherkin") {
        gherkinText = token.content;
      }
    });

    // If the issue title is the default title, update it with the test case title
    // This is useful when the issue title is generic and we want to prevent duplicates
    if (issue.title === defaultTitle) {
      core.warning(
        "No issue title provided, updating the issue title with the test case title",
      );

      // The new title is generated with the issue number and the author's name
      const authorName = `Automated test case #${issueNumber} opened by ${issue.user?.login || "unknown"}`;
      updatedTitle = issue.title.replace(defaultTitle, authorName).trim();

      if (updateTitle) {
        // Update the issue title with the new title
        await octokit.issues.update({
          owner,
          repo: parsedRepo,
          issue_number: issueNumber,
          title: updatedTitle,
          body: issue.body,
        });
      }
    }

    if (!gherkinText) {
      core.setFailed("Error: No Gherkin content found in the issue body.");
    } else {
      core.setOutput("title", updatedTitle);
      core.setOutput("body", issue.body);
      core.setOutput("feature", gherkinText.trim());

      core.notice("Gherkin content extracted successfully.");
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
    else
      core.setFailed("An error occurred while extracting the Gherkin content.");
  }
}
