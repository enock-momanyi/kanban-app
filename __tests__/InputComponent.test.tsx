import {fireEvent, render,screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import InputComponent from '../src/components/InputComponent'


it('should call cancel mock function when cancel button isclicked', () => {
    const addMockFn = jest.fn()
    const cancelMockFn = jest.fn()
    render(<InputComponent label="Name" inputRefVar={()=>{}} cancelFunc={cancelMockFn} addFunc={addMockFn} />)

    const buttonElem = screen.getByText('Cancel')

    fireEvent.click(buttonElem)

    expect(cancelMockFn).toHaveBeenCalled()
})
it('should not call add mock function when cancel button isclicked', () => {
    const addMockFn = jest.fn()
    const CancelMockFn = jest.fn()
    render(<InputComponent label="Name" inputRefVar={()=>{}} cancelFunc={CancelMockFn} addFunc={addMockFn} />)

    const buttonElem = screen.getByText('Cancel')

    fireEvent.click(buttonElem)

    expect(addMockFn).not.toHaveBeenCalled()
})

it('should call add mock function when add button isclicked', () => {
    const addMockFn = jest.fn()
    const cancelMockFn = jest.fn()
    render(<InputComponent label="Name" inputRefVar={()=>{}} cancelFunc={cancelMockFn} addFunc={addMockFn} />)

    const buttonElem = screen.getByText('Add')

    fireEvent.click(buttonElem)

    expect(addMockFn).toHaveBeenCalled()
})
it('should not call cancel mock function when add button isclicked', () => {
    const addMockFn = jest.fn()
    const cancelMockFn = jest.fn()
    render(<InputComponent label="Name" inputRefVar={()=>{}} cancelFunc={cancelMockFn} addFunc={addMockFn} />)

    const buttonElem = screen.getByText('Add')

    fireEvent.click(buttonElem)

    expect(cancelMockFn).not.toHaveBeenCalled()
})