import {gql} from '@apollo/client';

const RENAME_COLUMN = gql`
    mutation RenameColumn($columnId: ID!,$ columnTitle: String!){
        renameColumn(columnId: $columnId, columnTitle: $columnTitle){
            id,
            columnTitle,
            cards{
                id,
                cardText
            }
        }
    }
`;

export default RENAME_COLUMN;