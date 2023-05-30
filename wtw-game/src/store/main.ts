/*
 * @Date: 2023-05-14 17:00:41
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-05-14 17:38:31
 * @FilePath: \wtw-front\wtw-game\src\store\main.ts
 * @description: 
 */
import { configureStore } from '@reduxjs/toolkit'
import videoSlice from './voice'

export const store = configureStore({
  reducer: {
    voiceIndex: videoSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch