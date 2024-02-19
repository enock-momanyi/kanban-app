import {fireEvent, render,screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import PositionedMenu from "../src/components/PositionedMenu";

const Items = [{
    text: 'Menu Test',
    func: jest.fn()
}]

// it('should not contain text "Menu Test" without click event', () => {
//     const searchWord = 'Menu Test'
//     render(<PositionedMenu menuValues={Items} />)
//     const MenuItemlElem = screen.getByDisplayValue(searchWord)
//     expect(MenuItemlElem.textContent).not.toBe(searchWord)
// })
it('should contain MoreHorizSharpIcon', () => {
    render(<PositionedMenu menuValues={Items} />)
    const MenuIcon = screen.getByTestId('MoreHorizSharpIcon')
    expect(MenuIcon).toBeInTheDocument()
})
it('should not contain text Menu Test without clicking icon', () => {
    const searchWord = 'Menu Test'
    render(<PositionedMenu menuValues={Items} />)
    //const MenuIcon = screen.getByTestId('MoreHorizSharpIcon')
    expect(() => screen.getByText(searchWord)).toThrow()
})
it('should contain text Menu Test after clicking icon', () => {
    const searchWord = 'Menu Test'
    render(<PositionedMenu menuValues={Items} />)
    const MenuIcon = screen.getByTestId('MoreHorizSharpIcon')
    fireEvent.click(MenuIcon)
    const MenuItemlElem = screen.getByText(searchWord)
    expect(MenuItemlElem).toBeInTheDocument()
})
it('should call func when menu is closes',() => {
    const searchWord = 'Menu Test'
    render(<PositionedMenu menuValues={Items} />)
    const MenuIcon = screen.getByTestId('MoreHorizSharpIcon')
    fireEvent.click(MenuIcon)
    const MenuItemlElem = screen.getByText(searchWord)
    fireEvent.click(MenuItemlElem)
    expect(Items[0].func).toHaveBeenCalled()
})