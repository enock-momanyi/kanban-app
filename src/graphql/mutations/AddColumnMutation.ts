import {gql} from '@apollo/client';

const ADD_COLUMN = gql`
    mutation AddColumn($columnTitle: String!){
    addColumn(columnTitle: $columnTitle){
        id,
        columnTitle,
        cards{
            id,
            cardText
        }
    }
}
`;
export default ADD_COLUMN;