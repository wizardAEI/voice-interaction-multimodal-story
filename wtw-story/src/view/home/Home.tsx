/*
 * @Date: 2023-04-12 21:56:50
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-05-12 22:51:51
 * @FilePath: \wtw-front\wtw-story\src\view\home\Home.tsx
 * @description:
 */
import { ReactElement, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { nodeServerUrl } from "../../../../pkg/config/url";

const Container = styled.div`
  .bookshelf {
    width: 900px;
    margin: 5rem auto;
    text-align: center;
    position: relative;
  }

  .book-grid {
    z-index: 2;
    position: relative;
    transform: translateY(-15px);
  }
  .book-grid ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .book-grid ul li {
    justify-self: center;
  }
  .book-grid ul img {
    display: block;
    box-shadow: 0px -5px 20px 2px rgba(0, 0, 0, 0.3);
    width: 200px;
    height: 300px;
    -o-object-fit: cover;
    object-fit: cover;
    cursor: pointer;
    transition: .5s;
  }
  .book-grid ul img:hover {
    transform: translateY(-20px) scale(1.03);
  }
  .shelf-shadows {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1rem;
    border-radius: 2px;
    z-index: 1;
    box-shadow: 0px -5px 3px 0px rgba(170, 170, 170, 0.2),
      0px 15px 20px 0px rgba(170, 170, 170, 0.7),
      0px 5px 5px 0px rgba(119, 119, 119, 0.3);
  }

  .shelf {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1rem;
    background-color: #f9f9f9;
    border-radius: 2px;
    z-index: 3;
  }
`;

export default function Home() {
  const nav = useNavigate();

  useEffect(() => {}, []);

  return (
    <Container>
      <div className="bookshelf">
        <div className="book-grid">
          <ul>
            <li onClick={() => nav("/story/1")}>
              {" "}
              <img src={nodeServerUrl + "/assets/story/book_cover/fox_and_bear.jpg"} />
            </li>
            <li>
              {" "}
              <img src="https://images.penguinrandomhouse.com/cover/9781101931288" />
            </li>
            <li>
              {" "}
              <img src="https://images-na.ssl-images-amazon.com/images/I/51uLvJlKpNL._SX321_BO1,204,203,200_.jpg" />
            </li>
          </ul>
        </div>
        <div className="shelf-shadows"></div>
        <div className="shelf"></div>
      </div>
      <div className="bookshelf">
        <div className="book-grid">
          <ul>
            <li>
              {" "}
              <img src="https://images.penguinrandomhouse.com/cover/9781101931288" />
            </li>
            <li>
              {" "}
              <img src="https://i.harperapps.com/covers/9780062698162/x510.jpg" />
            </li>
            <li>
            </li>
          </ul>
        </div>
        <div className="shelf-shadows"></div>
        <div className="shelf"></div>
      </div>
    </Container>
  );
}
