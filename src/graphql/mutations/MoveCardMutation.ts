import {gql} from '@apollo/client';

const MOVE_CARD =gql`
    mutation MoveCard($cardId: ID!, $newColumnId: ID!){
    changeCardColumnId(cardId: $cardId, newColumnId: $newColumnId){
            id,
            columnTitle,
            cards {
                id,
                cardText
            }
    }
}
`;
export default MOVE_CARD;