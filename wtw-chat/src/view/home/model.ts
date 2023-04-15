/*
 * @Date: 2023-03-27 20:49:56
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-03-28 01:04:46
 * @FilePath: \wtw-front\wtw-chat\src\view\home\model.ts
 * @description: 
 */
export type ChatMessage = {
        id: number
        type: 'child' | 'bot'
        message: string
        avatar: string
    }[]