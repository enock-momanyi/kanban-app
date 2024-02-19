import { ApolloServer } from "@apollo/server"
import {startStandaloneServer} from '@apollo/server/standalone'

import { typeDefs } from "./schema"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { CardInt, ColumnInt } from "../../../interfaces/types"
import { NextApiHandler } from "next"

let db = {
    columns:[],
    cards:[]
}

const resolvers = {
    Query: {
        columns(){
            return db.columns
        },
        column(_,args){
            return db.columns.find((column: ColumnInt) => column.id === args.id)
        },
        hello(){
            return "Hello, world!"
        },
        allcards(){
            return db.cards
        }

    },
    Column:{
        cards(parent){
            return db.cards.filter((card: CardInt) => card.columnId === parent.id.toString())
        }
    },
    Mutation:{
        addColumn(_,args){
            if(db.columns.length == 5) return
            let column = {
                id: db.columns.length + 1,
                columnTitle: args.columnTitle
            }
            db.columns.push(column)
            return column
        },
        addCard(_,args){
            let card = {
                id: Math.floor(Math.random()*10000).toString(),
                columnId: args.columnId,
                cardText: args.cardText
            }
            db.cards.push(card)
            return card
        },
        renameColumn(_, args){
            db.columns = db.columns.map((col: ColumnInt) => {
                if(col.id.toString() === args.columnId){
                    return {...col, columnTitle: args.columnTitle}
                }
                return col
            })
            return db.columns.find((col: ColumnInt)=> col.id.toString() === args.columnId)
        },
        clearColumn(_,args){
            db.cards = db.cards.filter((cd: CardInt) => cd.columnId.toString() !== args.columnId)
        },
        deleteColumn(_, args){
            db.columns = db.columns.filter((col: ColumnInt) => col.id.toString() !== args.columnId)
            db.cards = db.cards.filter((cd: CardInt) => cd.columnId.toString() !== args.columnId)
        },
        editCard(_,args){
            let card;
            db.cards= db.cards.map((cd: CardInt) => {
                if(cd.id.toString() === args.cardId){
                    card = {...cd,cardText: args.updatedText}
                    return card
                }
                return cd
            })
            return card
        },
        changeCardColumnId(_, args){
            let card;
            db.cards= db.cards.map((cd: CardInt) => {
                if(cd.id.toString() === args.cardId){
                    card = {...cd,columnId: args.newColumnId}
                    return card
                }
                return cd
            })
            return db.columns          
        }
    }
}

const server: ApolloServer = new ApolloServer({
    typeDefs,
    resolvers
})

const handler:NextApiHandler = startServerAndCreateNextHandler(server,{
    context: async(req: Request, res: Response) => ({req,res})
})

export default handler