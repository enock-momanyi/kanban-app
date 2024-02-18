import {fireEvent, render,screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import CardComponent from '../src/components/card'


it('should contain the text "Test"',()=>{
    render(<CardComponent cardId='1' cardText="Test" editText={()=>{}}/>) //ARRANGE

    const inputElem = screen.getByText('Test') // ACT

    expect(inputElem).toBeInTheDocument() //ASSERT

})

it("Input field should be disabled",()=>{
    render(<CardComponent cardId='1' cardText="Test" editText={()=>{}}/>)
    const inputElem = screen.getByDisplayValue("Test")
    expect(inputElem).toBeDisabled();
 })
 it("on double click event input field is enabled",()=>{
    render(<CardComponent cardId='1' cardText="Test" editText={()=>{}}/>)
    const inputElem = screen.getByDisplayValue("Test")
    fireEvent.doubleClick(inputElem)
    expect(inputElem).toBeEnabled();
 })
 it("value should not change without double clicking",()=>{
    render(<CardComponent cardId='1' cardText="Test" editText={()=>{}}/>)
    const inputElem = screen.getByDisplayValue("Test")
    fireEvent.change(inputElem,{target:{value:'Not test'}})
    expect(inputElem.textContent).toBe('Test')
 })
 it("value should change after double clicking and changing input text",()=>{
    render(<CardComponent cardId='1' cardText="Test" editText={()=>{}}/>)
    const inputElem = screen.getByRole('textbox')
    fireEvent.doubleClick(inputElem)
    fireEvent.change(inputElem,{target:{value:'Not Test'}})
    expect(inputElem.value).toBe('Not Test')
 })
 it("on mouse leave input field should be disabled",()=>{
    render(<CardComponent cardId='1' cardText="Test" editText={()=>{}}/>)
    const inputElem = screen.getByDisplayValue("Test")
    fireEvent.doubleClick(inputElem)
    fireEvent.mouseLeave(inputElem);
    expect(inputElem).toBeDisabled();
 })

 it("on mouse leave input field should be remain disabled if disabled",()=>{
    render(<CardComponent cardId='1' cardText="Test" editText={()=>{}}/>)
    const inputElem = screen.getByDisplayValue("Test")
    fireEvent.mouseLeave(inputElem);
    expect(inputElem).toBeDisabled();
 })
 it("should call edittext function on mouse leave",() => {
    const editText = jest.fn((v1,v2)=>{})
    render(<CardComponent cardId='1' cardText="Test" editText={editText}/>)
    const inputElem = screen.getByDisplayValue("Test")
    fireEvent.doubleClick(inputElem)
    fireEvent.change(inputElem,{target:{value:'Not Test'}})
    fireEvent.mouseLeave(inputElem);
    expect(editText).toHaveBeenCalled();
 })
 