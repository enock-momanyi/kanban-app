export const typeDefs= `#graphql
    type Card{
        id: ID!
        columnId: ID!
        cardText: String
    }
    type Column{
        id: ID!
        columnTitle: String!
        cards: [Card]
    }
    type Query{
        columns: [Column]
        column(id: ID!):Column
        allcards: [Card]
        card(id: ID!): Card
        hello: String!
    }
    type Mutation{
        addColumn(columnTitle: String!): Column
        addCard(cardText: String!, columnId: ID!): Card
        editCard(cardId: ID!, updatedText: String!): Card
        renameColumn(columnId: ID!, columnTitle: String!): Column
        clearColumn(columnId: ID!): String
        deleteColumn(columnId: ID!): String
        changeCardColumnId(cardId: ID!, newColumnId: ID!): [Column]
    }

`