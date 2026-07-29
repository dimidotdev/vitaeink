import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import { resumeDocumentSchema, type ResumeDocument } from '../domain/resume'

const DATABASE_NAME = 'vitaeink'
const DATABASE_VERSION = 1
const STORE_NAME = 'resumes'
const CURRENT_DOCUMENT_KEY = 'current'

interface VitaeInkDatabase extends DBSchema {
  resumes: {
    key: string
    value: ResumeDocument
  }
}

let databasePromise: Promise<IDBPDatabase<VitaeInkDatabase>> | undefined
let saveQueue: Promise<void> = Promise.resolve()

const database = (): Promise<IDBPDatabase<VitaeInkDatabase>> => {
  databasePromise ??= openDB<VitaeInkDatabase>(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME)
    },
  })
  return databasePromise
}

export const loadResume = async (): Promise<ResumeDocument | undefined> => {
  const db = await database()
  const stored = await db.get(STORE_NAME, CURRENT_DOCUMENT_KEY)
  if (!stored) return undefined
  const result = resumeDocumentSchema.safeParse(stored)
  if (!result.success) throw new Error('The locally stored resume has an unsupported format.')
  return result.data
}

export const saveResume = (document: ResumeDocument): Promise<void> => {
  const result = resumeDocumentSchema.safeParse(document)
  if (!result.success) return Promise.reject(new Error('The current resume contains invalid data and was not saved.'))
  const snapshot = structuredClone(result.data)
  const operation = saveQueue.then(async () => {
    const db = await database()
    await db.put(STORE_NAME, snapshot, CURRENT_DOCUMENT_KEY)
  })
  saveQueue = operation.catch(() => undefined)
  return operation
}

export const clearResume = async (): Promise<void> => {
  const db = await database()
  await db.delete(STORE_NAME, CURRENT_DOCUMENT_KEY)
}

export const resetRepositoryForTests = (): void => {
  databasePromise = undefined
  saveQueue = Promise.resolve()
}
