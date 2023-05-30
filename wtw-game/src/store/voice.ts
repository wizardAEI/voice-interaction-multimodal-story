/*
 * @Date: 2023-05-14 17:02:21
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-05-14 17:37:23
 * @FilePath: \wtw-front\wtw-game\src\store\voice.ts
 * @description: 
 */
import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  value: 0,
}

export const vedioSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment } = vedioSlice.actions

export default vedioSlice.reducer