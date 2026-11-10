#!/usr/bin/env bun
/**
 * Agent context gate — keeps AGENTS.md the single source of agent instructions.
 *
 * Checks:
 *   1. AGENTS.md exists at the repository root and is not empty.
 *   2. Every relative Markdown link in AGENTS.md resolves.
 *   3. CLAUDE.md is absent or contains only the @AGENTS.md import.
 *   4. Every .claude/skills/<name>/SKILL.md has name and description frontmatter.
 *
 * Usage:
 *   bun run scripts/check_agent_docs.ts
 *
 * Exit: 0 = all checks pass, 1 = violations found.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { exit } from 'node:process'

const PROJECT_ROOT = new URL('..', import.meta.url).pathname

interface Violation {
  file: string
  line: number
  message: string
}

function readIfExists(path: string): string | null {
  try {
    return readFileSync(path, 'utf-8')
  } catch {
    return null
  }
}

function checkAgentsFile(root: string): Violation[] {
  const agentsPath = join(root, 'AGENTS.md')
  const agents = readIfExists(agentsPath)
  if (agents === null) {
    return [{ file: 'AGENTS.md', line: 0, message: 'missing agent instructions' }]
  }
  if (agents.trim() === '') {
    return [{ file: 'AGENTS.md', line: 1, message: 'AGENTS.md is empty' }]
  }
  return []
}

function stripTarget(target: string): string {
  const unwrapped = target.replace(/^<|>$/g, '')
  const withoutAnchor = unwrapped.split('#')[0]
  try {
    return decodeURIComponent(withoutAnchor)
  } catch {
    return withoutAnchor
  }
}

function relativeLinks(markdown: string): { target: string; line: number }[] {
  const links: { target: string; line: number }[] = []
  const pattern = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
  const lines = markdown.split('\n')
  for (let i = 0; i < lines.length; i++) {
    let match: RegExpExecArray | null
    pattern.lastIndex = 0
    while ((match = pattern.exec(lines[i])) !== null) {
      const target = match[1]
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(target)) continue
      links.push({ target: stripTarget(target), line: i + 1 })
    }
  }
  return links
}

function checkAgentsLinks(root: string, agents: string): Violation[] {
  const violations: Violation[] = []
  for (const link of relativeLinks(agents)) {
    if (!link.target) continue
    const resolved = link.target.startsWith('/')
      ? resolve(root, `.${link.target}`)
      : resolve(dirname(join(root, 'AGENTS.md')), link.target)
    if (!existsSync(resolved)) {
      violations.push({
        file: 'AGENTS.md',
        line: link.line,
        message: `unresolved relative link: ${link.target}`,
      })
    }
  }
  return violations
}

function checkClaudeImport(root: string): Violation[] {
  const claude = readIfExists(join(root, 'CLAUDE.md'))
  if (claude === null) return []
  if (claude.trim() !== '@AGENTS.md') {
    return [
      {
        file: 'CLAUDE.md',
        line: 1,
        message: 'must contain only @AGENTS.md so rules live in one file',
      },
    ]
  }
  return []
}

function frontmatterField(frontmatter: string, field: string): string | null {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'))
  const value = match?.[1]?.trim()
  return value ? value.replace(/^["']|["']$/g, '') : null
}

function checkSkills(root: string): Violation[] {
  const skillsDir = join(root, '.claude', 'skills')
  if (!existsSync(skillsDir)) return []
  const violations: Violation[] = []
  for (const entry of readdirSync(skillsDir)) {
    const skillPath = join(skillsDir, entry, 'SKILL.md')
    let isFile = false
    try {
      isFile = statSync(skillPath).isFile()
    } catch {
      isFile = false
    }
    if (!isFile) {
      violations.push({
        file: `.claude/skills/${entry}/SKILL.md`,
        line: 0,
        message: 'missing or broken skill file',
      })
      continue
    }
    const content = readFileSync(skillPath, 'utf-8')
    const match = content.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)
    if (!match) {
      violations.push({
        file: `.claude/skills/${entry}/SKILL.md`,
        line: 1,
        message: 'missing frontmatter',
      })
      continue
    }
    for (const field of ['name', 'description']) {
      if (!frontmatterField(match[1], field)) {
        violations.push({
          file: `.claude/skills/${entry}/SKILL.md`,
          line: 1,
          message: `frontmatter is missing ${field}`,
        })
      }
    }
  }
  return violations
}

function main(): number {
  const agents = readIfExists(join(PROJECT_ROOT, 'AGENTS.md'))
  const violations = [
    ...checkAgentsFile(PROJECT_ROOT),
    ...checkAgentsLinks(PROJECT_ROOT, agents ?? ''),
    ...checkClaudeImport(PROJECT_ROOT),
    ...checkSkills(PROJECT_ROOT),
  ]

  if (violations.length === 0) {
    console.log('Agent docs checks passed.')
    return 0
  }

  for (const violation of violations) {
    const location = violation.line ? `${violation.file}:${violation.line}` : violation.file
    console.log(`[AGENT_DOCS] ${location} — ${violation.message}`)
  }
  console.log(`\n${violations.length} violation(s) found.`)
  return 1
}

exit(main())
