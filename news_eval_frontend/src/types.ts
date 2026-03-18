export type NewsSample = {
  article_id?: string | null
  sample_id: string
  context_type?: string | null

  previous_sentence?: string | null
  target_sentence?: string | null
  next_sentence?: string | null

  gold_label?: string | null
  llm_label?: 'F' | 'C' | 'M' | string | null

  segment_1?: string | null
  segment_1_label?: string | null
  segment_2?: string | null
  segment_2_label?: string | null
}

export type FinalLabel = 'F' | 'C' | 'M' | 'Unsure'

export type EvaluationPayload = {
  sample_id: string
  annotator_id: string
  article_id?: string | null

  q1_label_appropriateness: number
  q2_need_segmentation?: number | null
  q3_segmentation_quality?: number | null
  q4_segment_1_label_quality?: number | null
  q4_segment_2_label_quality?: number | null
  q5_final_label: FinalLabel
}
