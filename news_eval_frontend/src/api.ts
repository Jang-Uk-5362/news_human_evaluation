import type { EvaluationPayload, NewsSample } from './types'

// 로컬 개발 기본값을 두되, 배포 환경에서는 VITE_API_BASE로 주입 가능
// 예: VITE_API_BASE=https://your-backend.example.com/api
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!res.ok) {
    let body: unknown = null
    try {
      body = await res.json()
    } catch {
      body = await res.text()
    }
    throw new Error(`API ${res.status}: ${JSON.stringify(body)}`)
  }

  return (await res.json()) as T
}

export async function getRandomSample(): Promise<NewsSample> {
  return request<NewsSample>('/news-samples/random/')
}

export async function createEvaluation(
  payload: EvaluationPayload,
): Promise<{ message: string; id?: number; annotator_id?: string; article_id?: string; sample_id?: string }>
{
  return request('/evaluations/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
