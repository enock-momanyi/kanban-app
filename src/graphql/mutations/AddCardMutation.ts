import {gql} from '@apollo/client';

const ADD_CARD = gql`
mutation AddCard($cardText: String!, $columnId: ID!){
    addCard(cardText: $cardText, columnId: $columnId){
        id,
        cardText
    }
}
`;
export default ADD_CARD;