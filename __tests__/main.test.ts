import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as core from '@actions/core'
import { Octokit } from '@octokit/rest'
import { run } from '../src/main'

vi.mock('@actions/core')
vi.mock('@octokit/rest')

describe('run function', () => {
  const mockGetInput = vi.fn()
  const mockGetBooleanInput = vi.fn()
  const mockSetOutput = vi.fn()
  const mockSetFailed = vi.fn()
  const mockNotice = vi.fn()
  const mockInfo = vi.fn()
  const mockWarning = vi.fn()
  const mockIssuesGet = vi.fn()
  const mockIssuesUpdate = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()

    core.getInput = mockGetInput
    core.getBooleanInput = mockGetBooleanInput
    core.setOutput = mockSetOutput
    core.setFailed = mockSetFailed
    core.notice = mockNotice
    core.info = mockInfo
    core.warning = mockWarning

    Octokit.prototype.issues = {
      get: mockIssuesGet,
      update: mockIssuesUpdate
    } as never
  })

  it('should extract Gherkin content from the issue body', async () => {
    // Mock inputs
    mockGetInput.mockImplementation(key => {
      if (key === 'token') return 'fake-token'
      if (key === 'owner') return 'octocat'
      if (key === 'repo') return 'octocat/example-repo'
      if (key === 'issue') return '1'
      if (key === 'update_title') return 'true'
      return undefined
    })

    // Mock GitHub API response
    mockIssuesGet.mockResolvedValueOnce({
      data: {
        title: 'Test Title',
        body: '```gherkin\nFeature: Test Gherkin Content\n```',
        user: { login: 'octocat' }
      }
    })

    await run()

    expect(mockIssuesGet).toHaveBeenCalledOnce()
    expect(mockSetOutput).toHaveBeenCalledWith('title', 'Test Title')
    expect(mockSetOutput).toHaveBeenCalledWith(
      'body',
      '```gherkin\nFeature: Test Gherkin Content\n```'
    )
    expect(mockSetOutput).toHaveBeenCalledWith(
      'feature',
      'Feature: Test Gherkin Content'
    )
    expect(mockNotice).toHaveBeenCalledWith(
      'Gherkin content extracted successfully.'
    )
  })

  it('should set failure if no Gherkin content is found', async () => {
    // Mock inputs
    mockGetInput.mockImplementation(key => {
      if (key === 'token') return 'fake-token'
      if (key === 'owner') return 'octocat'
      if (key === 'repo') return 'octocat/example-repo'
      if (key === 'issue') return '1'
      return undefined
    })

    // Mock GitHub API response with no Gherkin content
    mockIssuesGet.mockResolvedValueOnce({
      data: {
        title: 'Test Title',
        body: 'No gherkin content here.',
        user: { login: 'octocat' }
      }
    })

    await run()

    expect(mockIssuesGet).toHaveBeenCalledOnce()
    expect(mockSetFailed).toHaveBeenCalledWith(
      'Error: No Gherkin content found in the issue body.'
    )
  })

  it('should set failure if no content is found', async () => {
    // Mock inputs
    mockGetInput.mockImplementation(key => {
      if (key === 'token') return 'fake-token'
      if (key === 'owner') return 'octocat'
      if (key === 'repo') return 'octocat/example-repo'
      if (key === 'issue') return '1'
      return undefined
    })

    // Mock GitHub API response with no Gherkin content
    mockIssuesGet.mockResolvedValueOnce({
      data: {
        title: 'Test Title',
        user: { login: 'octocat' }
      }
    })

    await run()

    expect(mockIssuesGet).toHaveBeenCalledOnce()
    expect(mockSetFailed).toHaveBeenCalledWith(
      'Error: No Gherkin content found in the issue body.'
    )
  })

  it('should set failure if no param is passed', async () => {
    // Mock inputs
    mockGetInput.mockImplementation(key => {
      if (key === 'token') return ''
      if (key === 'owner') return ''
      if (key === 'repo') return ''
      if (key === 'issue') return ''
      return undefined
    })

    // Mock GitHub API response with no Gherkin content
    mockIssuesGet.mockResolvedValueOnce({
      data: {
        title: 'Test Title',
        body: 'No gherkin content here.',
        user: { login: 'octocat' }
      }
    })

    await run()

    expect(mockIssuesGet).toHaveBeenCalledOnce()
    expect(mockSetFailed).toHaveBeenCalledWith(
      'Owner, repo, and issue number are required inputs.'
    )
  })

  it('should set failure if no token is passed', async () => {
    // Mock inputs
    mockGetInput.mockImplementation(key => {
      if (key === 'token') return ''
      if (key === 'owner') return 'octocat'
      if (key === 'repo') return 'octocat/example-repo'
      if (key === 'issue') return '1'
      return undefined
    })

    // Mock GitHub API response with no Gherkin content
    mockIssuesGet.mockResolvedValueOnce({
      data: {
        title: 'Test Title',
        body: 'No gherkin content here.',
        user: { login: 'octocat' }
      }
    })

    await run()

    expect(mockIssuesGet).toHaveBeenCalledOnce()
    expect(mockSetFailed).toHaveBeenCalledWith('GitHub token is required.')
  })

  it('should set failure if no owner is passed', async () => {
    // Mock inputs
    mockGetInput.mockImplementation(key => {
      if (key === 'token') return 'fake-token'
      if (key === 'owner') return ''
      if (key === 'repo') return 'octocat/example-repo'
      if (key === 'issue') return '1'
      return undefined
    })

    // Mock GitHub API response with no Gherkin content
    mockIssuesGet.mockResolvedValueOnce({
      data: {
        title: 'Test Title',
        body: 'No gherkin content here.',
        user: { login: 'octocat' }
      }
    })

    await run()

    expect(mockIssuesGet).toHaveBeenCalledOnce()
    expect(mockSetFailed).toHaveBeenCalledWith(
      'Owner, repo, and issue number are required inputs.'
    )
  })

  it('should set failure if no repo is passed', async () => {
    // Mock inputs
    mockGetInput.mockImplementation(key => {
      if (key === 'token') return 'fake-token'
      if (key === 'owner') return 'octocat'
      if (key === 'repo') return ''
      if (key === 'issue') return '1'
      return undefined
    })

    // Mock GitHub API response with no Gherkin content
    mockIssuesGet.mockResolvedValueOnce({
      data: {
        title: 'Test Title',
        body: 'No gherkin content here.',
        user: { login: 'octocat' }
      }
    })

    await run()

    expect(mockIssuesGet).toHaveBeenCalledOnce()
    expect(mockSetFailed).toHaveBeenCalledWith(
      'Owner, repo, and issue number are required inputs.'
    )
  })

  it('should set failure if no issue number is passed', async () => {
    // Mock inputs
    mockGetInput.mockImplementation(key => {
      if (key === 'token') return 'fake-token'
      if (key === 'owner') return 'octocat'
      if (key === 'repo') return 'octocat/example-repo'
      if (key === 'issue') return ''
      return undefined
    })

    // Mock GitHub API response with no Gherkin content
    mockIssuesGet.mockResolvedValueOnce({
      data: {
        title: 'Test Title',
        body: 'No gherkin content here.',
        user: { login: 'octocat' }
      }
    })

    await run()

    expect(mockIssuesGet).toHaveBeenCalledOnce()
    expect(mockSetFailed).toHaveBeenCalledWith(
      'Owner, repo, and issue number are required inputs.'
    )
  })

  it('should set failure if incorrect issue number is passed', async () => {
    // Mock inputs
    mockGetInput.mockImplementation(key => {
      if (key === 'token') return 'fake-token'
      if (key === 'owner') return 'octocat'
      if (key === 'repo') return 'octocat/example-repo'
      if (key === 'issue') return 'potato'
      return undefined
    })

    // Mock GitHub API response with no Gherkin content
    mockIssuesGet.mockResolvedValueOnce({
      data: {
        title: 'Test Title',
        body: 'No gherkin content here.',
        user: { login: 'octocat' }
      }
    })

    await run()

    expect(mockIssuesGet).toHaveBeenCalledOnce()
    expect(mockSetFailed).toHaveBeenCalledWith(
      'Owner, repo, and issue number are required inputs.'
    )
  })

  it('should set failure if negative issue number is passed', async () => {
    // Mock inputs
    mockGetInput.mockImplementation(key => {
      if (key === 'token') return 'fake-token'
      if (key === 'owner') return 'octocat'
      if (key === 'repo') return 'octocat/example-repo'
      if (key === 'issue') return '-5'
      return undefined
    })

    // Mock GitHub API response with no Gherkin content
    mockIssuesGet.mockResolvedValueOnce({
      data: {
        title: 'Test Title',
        body: 'No gherkin content here.',
        user: { login: 'octocat' }
      }
    })

    await run()

    expect(mockIssuesGet).toHaveBeenCalledOnce()
    expect(mockSetFailed).toHaveBeenCalledWith(
      'Owner, repo, and issue number are required inputs.'
    )
  })

  it('should set failure if issue number is passed as 0', async () => {
    // Mock inputs
    mockGetInput.mockImplementation(key => {
      if (key === 'token') return 'fake-token'
      if (key === 'owner') return 'octocat'
      if (key === 'repo') return 'octocat/example-repo'
      if (key === 'issue') return '0'
      return undefined
    })

    // Mock GitHub API response with no Gherkin content
    mockIssuesGet.mockResolvedValueOnce({
      data: {
        title: 'Test Title',
        body: 'No gherkin content here.',
        user: { login: 'octocat' }
      }
    })

    await run()

    expect(mockIssuesGet).toHaveBeenCalledOnce()
    expect(mockSetFailed).toHaveBeenCalledWith(
      'Owner, repo, and issue number are required inputs.'
    )
  })

  it('should redo the issue title if default provided', async () => {
    // Mock inputs
    mockGetInput.mockImplementation(key => {
      if (key === 'token') return 'fake-token'
      if (key === 'owner') return 'octocat'
      if (key === 'repo') return 'octocat/example-repo'
      if (key === 'issue') return '1'
      if (key === 'default_title') return 'Test Title'
      if (key === 'update_title') return 'true'
      return undefined
    })
    mockGetBooleanInput.mockImplementation(key => {
      if (key === 'update_title') return true
      return undefined
    })

    // Mock GitHub API response
    mockIssuesGet.mockResolvedValueOnce({
      data: {
        title: 'Test Title',
        body: '```gherkin\nFeature: Test Gherkin Content\n```',
        user: { login: 'octocat' }
      }
    })

    mockIssuesUpdate.mockResolvedValueOnce({
      data: {
        title: 'Automated test case #1 opened by octocat',
        body: '```gherkin\nFeature: Test Gherkin Content\n```',
        user: { login: 'octocat' }
      }
    })

    await run()

    expect(mockIssuesGet).toHaveBeenCalledOnce()
    expect(mockIssuesUpdate).toHaveBeenCalledOnce()

    expect(mockWarning).toHaveBeenCalledWith(
      'No issue title provided, updating the issue title with the test case title'
    )

    expect(mockSetOutput).toHaveBeenCalledWith(
      'title',
      'Automated test case #1 opened by octocat'
    )
    expect(mockSetOutput).toHaveBeenCalledWith(
      'body',
      '```gherkin\nFeature: Test Gherkin Content\n```'
    )
    expect(mockSetOutput).toHaveBeenCalledWith(
      'feature',
      'Feature: Test Gherkin Content'
    )

    expect(mockNotice).toHaveBeenCalledWith(
      'Gherkin content extracted successfully.'
    )
  })

  it('should redo the issue title if default provided and no user', async () => {
    // Mock inputs
    mockGetInput.mockImplementation(key => {
      if (key === 'token') return 'fake-token'
      if (key === 'owner') return 'octocat'
      if (key === 'repo') return 'octocat/example-repo'
      if (key === 'issue') return '1'
      if (key === 'default_title') return 'Test Title'
      if (key === 'update_title') return 'true'
      return undefined
    })
    mockGetBooleanInput.mockImplementation(key => {
      if (key === 'update_title') return true
      return undefined
    })

    // Mock GitHub API response
    mockIssuesGet.mockResolvedValueOnce({
      data: {
        title: 'Test Title',
        body: '```gherkin\nFeature: Test Gherkin Content\n```'
      }
    })

    mockIssuesUpdate.mockResolvedValueOnce({
      data: {
        title: 'Automated test case #1 opened by unknown',
        body: '```gherkin\nFeature: Test Gherkin Content\n```'
      }
    })

    await run()

    expect(mockIssuesGet).toHaveBeenCalledOnce()
    expect(mockIssuesUpdate).toHaveBeenCalledOnce()

    expect(mockWarning).toHaveBeenCalledWith(
      'No issue title provided, updating the issue title with the test case title'
    )

    expect(mockSetOutput).toHaveBeenCalledWith(
      'title',
      'Automated test case #1 opened by unknown'
    )
    expect(mockSetOutput).toHaveBeenCalledWith(
      'body',
      '```gherkin\nFeature: Test Gherkin Content\n```'
    )
    expect(mockSetOutput).toHaveBeenCalledWith(
      'feature',
      'Feature: Test Gherkin Content'
    )

    expect(mockNotice).toHaveBeenCalledWith(
      'Gherkin content extracted successfully.'
    )
  })

  it('should provide a new issue title if default provided but no update on original', async () => {
    // Mock inputs
    mockGetInput.mockImplementation(key => {
      if (key === 'token') return 'fake-token'
      if (key === 'owner') return 'octocat'
      if (key === 'repo') return 'octocat/example-repo'
      if (key === 'issue') return '1'
      if (key === 'default_title') return 'Test Title'
      return undefined
    })
    mockGetBooleanInput.mockImplementation(key => {
      if (key === 'update_title') return false
      return undefined
    })

    // Mock GitHub API response
    mockIssuesGet.mockResolvedValueOnce({
      data: {
        title: 'Test Title',
        body: '```gherkin\nFeature: Test Gherkin Content\n```'
      }
    })

    await run()

    expect(mockIssuesGet).toHaveBeenCalledOnce()
    expect(mockIssuesUpdate).toBeCalledTimes(0)

    expect(mockWarning).toHaveBeenCalledWith(
      'No issue title provided, updating the issue title with the test case title'
    )

    expect(mockSetOutput).toHaveBeenCalledWith(
      'title',
      'Automated test case #1 opened by unknown'
    )
    expect(mockSetOutput).toHaveBeenCalledWith(
      'body',
      '```gherkin\nFeature: Test Gherkin Content\n```'
    )
    expect(mockSetOutput).toHaveBeenCalledWith(
      'feature',
      'Feature: Test Gherkin Content'
    )

    expect(mockNotice).toHaveBeenCalledWith(
      'Gherkin content extracted successfully.'
    )
  })

  it('should return error if get fails and throws exception', async () => {
    // Mock inputs
    mockGetInput.mockImplementation(key => {
      if (key === 'token') return 'fake-token'
      if (key === 'owner') return 'octocat'
      if (key === 'repo') return 'octocat/example-repo'
      if (key === 'issue') return '1'
      return undefined
    })

    // Mock GitHub API response with no Gherkin content
    mockIssuesGet.mockRejectedValueOnce(
      new Error('Error: No Gherkin content found in the issue body.')
    )

    await run()

    expect(mockIssuesGet).toHaveBeenCalledOnce()
    expect(mockSetFailed).toHaveBeenCalledWith(
      'Error: No Gherkin content found in the issue body.'
    )
  })

  it('should return error if get fails and throws exception', async () => {
    // Mock inputs
    mockGetInput.mockImplementation(key => {
      if (key === 'token') return 'fake-token'
      if (key === 'owner') return 'octocat'
      if (key === 'repo') return 'octocat/example-repo'
      if (key === 'issue') return '1'
      return undefined
    })

    // Mock GitHub API response with no Gherkin content
    mockIssuesGet.mockRejectedValueOnce(
      'Error: No Gherkin content found in the issue body.'
    )

    await run()

    expect(mockIssuesGet).toHaveBeenCalledOnce()
    expect(mockSetFailed).toHaveBeenCalledWith(
      'An error occurred while extracting the Gherkin content.'
    )
  })
})
