import {gql} from '@apollo/client';

const GET_COLUMN =gql`
    query getColumn{
    columns{
        id,
        columnTitle,
        cards {
            id,
            cardText
        }
    }
}
`;

export default GET_COLUMN;