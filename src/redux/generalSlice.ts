import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type SentencesType = {
  // id: number
  sentence: string
  createdAt: number
  fav: boolean
}

export interface GeneralStateType {
  value: number
  sentenceText: string
  sentences: SentencesType[]
}

const localSentences: [] = localStorage.getItem("sentences") ? JSON.parse(localStorage.getItem("sentences") as string) : [];

const initialState: GeneralStateType = {
  value: 0,
  sentenceText: "",
  sentences: localSentences,
}

export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setSentenceText: (state, action: PayloadAction<string>) => {
      state.sentenceText = action.payload
    },
  },
})

export const {
  setSentenceText,

} = generalSlice.actions
export default generalSlice.reducer