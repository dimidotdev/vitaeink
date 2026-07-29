import AxeBuilder from '@axe-core/playwright'
import { readFile } from 'node:fs/promises'
import { expect, test, type Page } from '@playwright/test'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { createSampleResume } from '../src/domain/sampleResume'

const extractPdfPages = async (path: string): Promise<string[]> => {
  const bytes = new Uint8Array(await readFile(path))
  const loadingTask = getDocument({ data: bytes })
  const pdf = await loadingTask.promise
  const pages: string[] = []
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '))
  }
  await loadingTask.destroy()
  return pages
}

const extractPdfText = async (path: string): Promise<string> => (await extractPdfPages(path)).join('\n')

const importDocument = async (page: Page, document: ReturnType<typeof createSampleResume>, accept = true): Promise<void> => {
  const dialogPromise = page.waitForEvent('dialog')
  const uploadPromise = page.getByLabel('Import resume JSON').setInputFiles({
    name: 'resume.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(document)),
  })
  const dialog = await dialogPromise
  await (accept ? dialog.accept() : dialog.dismiss())
  await uploadPromise
}

test('edits the sample and persists it locally', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Alex Rivera', level: 1 })).toBeVisible()
  const name = page.getByLabel('Full name')
  await name.fill('Taylor Santos')
  await expect(page.getByRole('heading', { name: 'Taylor Santos', level: 1 })).toBeVisible()
  await expect(page.getByText('Saved on this device')).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Taylor Santos', level: 1 })).toBeVisible()
})

test('has no serious accessibility violations in the default flow', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([])

  await page.getByLabel('More actions').click()
  const overlayResults = await new AxeBuilder({ page }).analyze()
  expect(overlayResults.violations).toEqual([])
})

test('starts from the system theme and persists a manual light or dark choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('.resume-document')).toHaveCSS('background-color', 'rgb(255, 255, 255)')

  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.getByRole('button', { name: 'Switch to dark theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('persists interface language without changing the resume language', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Interface language/ }).click()
  await page.getByRole('menuitemradio', { name: 'Português (Brasil)' }).click()

  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
  await expect(page).toHaveTitle(/Estúdio privado/)
  await expect(page.locator('.workspace-editor').getByRole('heading', { name: 'Perfil' })).toBeVisible()
  await expect(page.locator('.resume-document')).toHaveAttribute('lang', 'en')
  await expect(page.locator('.resume-document').getByRole('heading', { name: 'Profile' })).toBeVisible()

  await page.reload()
  await expect(page.getByLabel('Nome completo')).toBeVisible()
  await expect(page.locator('.resume-document')).toHaveAttribute('lang', 'en')
})

test('keeps a secondary entry open while it is edited', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Experience', exact: true }).click()
  const secondEntry = page.locator('.workspace-editor details').nth(1)
  await secondEntry.locator('summary').click()
  await secondEntry.getByLabel('Role').fill('Platform Engineer')
  await expect(secondEntry).toHaveAttribute('open', '')
  await expect(secondEntry.getByLabel('Role')).toHaveValue('Platform Engineer')
})

test('keeps import and backup actions reachable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByLabel('More actions').click()
  await expect(page.getByRole('menuitem', { name: 'Import JSON' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Backup JSON' })).toBeVisible()
  await expect(page.getByRole('menuitemradio', { name: 'Português (Brasil)' })).toBeVisible()
})

test('opens the document menu by keyboard and restores focus on close', async ({ page }) => {
  await page.goto('/')
  const trigger = page.getByLabel('More actions')
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('menuitem', { name: 'Import JSON' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
})

test('keeps the document title and local save status visible on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByLabel('Document name')).toBeVisible()
  await expect(page.getByText('Saved on this device')).toBeVisible()
})

test('does not overflow horizontally at the desktop-to-mobile boundary', async ({ page }) => {
  await page.setViewportSize({ width: 930, height: 900 })
  await page.goto('/')
  const sizes = await page.evaluate(() => ({ viewport: window.innerWidth, content: document.documentElement.scrollWidth }))
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport)
})

test('keeps desktop scrolling usable while replacing scrollbars with visual hints', async ({ page }) => {
  await page.goto('/')
  const editor = page.locator('.workspace-editor')
  const bottomHint = page.locator('.workspace-editor-frame .scroll-hint-bottom')
  const topHint = page.locator('.workspace-editor-frame .scroll-hint-top')

  await expect.poll(async () => editor.evaluate((node) => getComputedStyle(node).scrollbarWidth)).toBe('none')
  await expect(bottomHint).toHaveAttribute('data-visible', 'true')
  await editor.focus()
  await page.keyboard.press('PageDown')
  await expect.poll(async () => editor.evaluate((node) => node.scrollTop)).toBeGreaterThan(0)
  await expect(topHint).toHaveAttribute('data-visible', 'true')

  await editor.evaluate((node) => { node.scrollTop = node.scrollHeight; node.dispatchEvent(new Event('scroll')) })
  await expect(bottomHint).not.toHaveAttribute('data-visible', 'true')
})

test('navigates sections and controls the live preview on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('combobox', { name: 'Resume section', exact: true }).selectOption('experience')
  await expect(page.locator('.workspace-editor').getByRole('heading', { name: 'Experience' })).toBeVisible()
  await page.getByRole('button', { name: 'Preview', exact: true }).click()
  await expect(page.locator('.resume-document').getByRole('heading', { name: 'Alex Rivera' })).toBeVisible()
  const zoom = page.getByRole('button', { name: /Preview zoom/ })
  const before = await zoom.textContent()
  await page.getByRole('button', { name: 'Zoom in' }).click()
  await expect(zoom).not.toHaveText(before ?? '')
})

test('preserves separators while typing a skill list', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Skills', exact: true }).click()
  const skills = page.getByLabel('Skills, separated by commas').first()
  await skills.fill('')
  await skills.pressSequentially('Java, Spring Boot')
  await expect(skills).toHaveValue('Java, Spring Boot')
  await expect(page.locator('.resume-document').getByText(/Backend: Java, Spring Boot/)).toBeVisible()
})

test('asks before an import replaces the current resume', async ({ page }) => {
  await page.goto('/')
  const imported = createSampleResume()
  imported.basics.name = 'Imported Person'

  await importDocument(page, imported, false)
  await expect(page.getByRole('heading', { name: 'Alex Rivera', level: 1 })).toBeVisible()

  await importDocument(page, imported)
  await expect(page.getByRole('heading', { name: 'Imported Person', level: 1 })).toBeVisible()
})

test('flags and suppresses an empty project entry', async ({ page }) => {
  await page.goto('/')
  const initialEntries = await page.locator('.resume-document .resume-entry').count()
  await page.getByRole('button', { name: 'Projects', exact: true }).click()
  await page.getByRole('button', { name: 'Add project' }).click()
  await expect(page.locator('.resume-document .resume-entry')).toHaveCount(initialEntries)
  await page.getByRole('button', { name: /Document check/ }).click()
  await expect(page.getByText('Name or remove this project')).toBeVisible()
  await expect(page.getByText('Ready for a human review')).toHaveCount(0)
})

test('exports selectable ATS-readable text in print media', async ({ page }, testInfo) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Experience', exact: true }).click()
  const secondEntry = page.locator('.workspace-editor details').nth(1)
  await secondEntry.locator('summary').click()
  await secondEntry.getByRole('button', { name: /Move .* up/ }).hover()
  await expect(page.locator('[data-slot="tooltip-content"]')).toBeVisible()
  const pdfPath = testInfo.outputPath('vitaeink-sample.pdf')
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, preferCSSPageSize: true })
  const text = await extractPdfText(pdfPath)
  expect(text).toContain('Alex Rivera')
  expect(text).toContain('Senior Software Engineer')
  expect(text).toContain('EDUCATION')
  expect(text).not.toContain('Skip to editor')
  expect(text).not.toContain('Move up')
  expect(text.indexOf('PROFILE')).toBeLessThan(text.indexOf('EXPERIENCE'))
})

test('keeps ordinary experience entries together across PDF pages', async ({ page }, testInfo) => {
  await page.goto('/')
  const document = createSampleResume()
  document.basics.summary = 'A focused software engineer profile used to verify predictable multi-page print flow.'
  document.experience = Array.from({ length: 9 }, (_, index) => ({
    id: `pagination-${index}`,
    company: `ORGANIZATION_${index}`,
    role: `ROLE_${index}`,
    location: 'Remote',
    startDate: '2023-01',
    endDate: '2024-01',
    current: false,
    highlights: Array.from({ length: 4 }, (_item, outcome) => `OUTCOME_${index}_${outcome} Delivered a documented engineering result across services, interfaces, tests, and deployment workflows.`),
  }))
  await importDocument(page, document)
  await expect(page.getByRole('heading', { name: 'ROLE_8', level: 3 })).toBeVisible()

  const pdfPath = testInfo.outputPath('vitaeink-pagination.pdf')
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, preferCSSPageSize: true })
  const pages = await extractPdfPages(pdfPath)
  expect(pages.length).toBeGreaterThan(1)
  for (let index = 0; index < document.experience.length; index += 1) {
    const outcomePages = pages.filter((text) => text.includes(`OUTCOME_${index}_`))
    expect(outcomePages.length).toBe(1)
    expect(outcomePages[0]).toContain(`ROLE_${index}`)
  }
})
