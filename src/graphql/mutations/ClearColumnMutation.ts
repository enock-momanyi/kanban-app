import {gql} from '@apollo/client';

const CLEAR_COLUMN = gql`
    mutation ClearColumn($columnId: ID!){
    clearColumn(columnId: $columnId)
}
`;

export default CLEAR_COLUMN;