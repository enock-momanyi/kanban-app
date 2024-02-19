import {gql} from '@apollo/client';

const DELETE_COLUMN = gql`
    mutation DeleteColumn($columnId: ID!){
    deleteColumn(columnId: $columnId)
}
`;

export default DELETE_COLUMN;