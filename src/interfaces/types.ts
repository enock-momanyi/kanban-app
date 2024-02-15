import { MouseEventHandler, Ref } from "react"

export interface CardInt{
    id: string
    columnId: string
    cardText: string
}
export interface ColumnInt{
    id: string
    columnTitle: string
}
export interface ColumnCardInt extends ColumnInt{
    cards: CardInt[]
}
export interface CardComponentProps{
    cardId: string
    cardText: String
    editText: Function
}
export interface ColumnComponentProps{
    columnTitle: string
    columnId: String
    cardSet: CardInt[]
    deleteColumn: Function
    clearCardState: Function
    updateAddCardState: Function
    setMessage: Function
}
export interface InputComponentProps{
    label: String
    inputRefVar: Ref<HTMLInputElement>
    cancelFunc: MouseEventHandler
    addFunc: MouseEventHandler
}

export interface MenuItemValue{
    text: string
    func: Function
}
export interface PositionMenuProp{
    menuValues: MenuItemValue[]
}

export interface AddColumnFeed extends ColumnInt{
    cards: CardInt[]
    __typename: String
}

export interface AddCardFeed extends CardInt{
    _typename: String
}

export interface updateCardParams{
    columnId: string
    newCard?: CardInt
    cardText?: string
}