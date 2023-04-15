/*
 * @Date: 2023-03-01 16:10:51
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-03-19 23:55:07
 * @FilePath: \wtw-front\main-app\src\views\home\Home.tsx
 * @description: 
 */
import { PropsWithRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

function Home(props: PropsWithRef<any>) {
    const nav = useNavigate()
    useEffect(() => {
      nav('/chat', {
        // repalce: true 表明无法回退
      })
    }, []);
    return (
      <>
        <div>
            home
        </div>
      </>
    );
}
  
  export default Home;