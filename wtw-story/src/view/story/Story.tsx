import { useParams } from "react-router-dom"
import styled from "styled-components"
import { nodeServerUrl } from "../../../../pkg/config/url"

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-image: ${{nodeServerUrl} + 'assets/story/bac/forest.png'};
`
export default function Story() {
    const {id} = useParams()
    return (
        <Container>
            <h1>{id}</h1>
        </Container>
    )
}