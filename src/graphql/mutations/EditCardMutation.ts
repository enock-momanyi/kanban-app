import {gql} from '@apollo/client';

const EDIT_CARD = gql`
    mutation EditCard($cardId: ID!, $updatedText: String!){
    editCard(cardId: $cardId, updatedText: $updatedText){
        id,
        cardText
    }
}
`;

export default EDIT_CARD;