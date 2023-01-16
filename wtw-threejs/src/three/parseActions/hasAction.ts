import { ResourceLimits } from "worker_threads"
import { actions } from "./actions"
import { Actions } from "./model"

/*
 * @Date: 2023-01-16 16:51:02
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-01-16 17:14:10
 * @FilePath: \wtw-front\wtw-threejs\src\three\parseActions\hasAction.ts
 * @description:
 */
export default function (results: string[]): Actions {
  let resAction: Actions = "no action"
  for(let i = 0; i < results.length; i++) {
     actions.forEach((action, key) => {
        results[i].includes(key) && (resAction = (action as Actions))
     }) 
  }
  return resAction
}
