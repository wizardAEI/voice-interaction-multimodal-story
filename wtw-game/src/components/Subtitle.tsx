import styled from "styled-components";
import { zIndexDefine } from "../../../pkg/css/define";
import { nodeServerUrl } from "../../../pkg/config/url";

const Container = styled.div`
  display: flex;
  font-family: cat;
  z-index: ${zIndexDefine.topOne};
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
  bottom: 20px;
  .subtitle {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    background-image: url(${nodeServerUrl + '/assets/game/subtitle_cover.png'});
    background-size: cover;
    border-radius: 40px;
    overflow: hidden;
    padding: 38px;
    bottom: 20px;
  }
`;

export function SubTitle(props: {
    subtitleVal: string
}) {
  return (
    <Container>
      <div className="subtitle">
        <span>{props.subtitleVal}</span>
      </div>
    </Container>
  );
}
