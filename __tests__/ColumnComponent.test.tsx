import {fireEvent, render,screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import ColumnComponent from "../src/components/Column";
import { ColumnComponentProps } from '../src/interfaces/types';
import { MockedProvider } from '@apollo/client/testing';
import ADD_CARD from '../src/graphql/mutations/AddCardMutation';
import CLEAR_COLUMN from '../src/graphql/mutations/ClearColumnMutation';
import EDIT_CARD from '../src/graphql/mutations/EditCardMutation';
import DELETE_COLUMN from '../src/graphql/mutations/DeleteColumnMutation';
import RENAME_COLUMN from '../src/graphql/mutations/RenameColumnMutation';
const componentProps :ColumnComponentProps = {
    columnId: '1',
    columnTitle: 'RandomTitle',
    cardSet: [
        {
            id: '32',
            columnId:'1',
            cardText: 'Integrate the apis'
        }
    ],
    deleteColumn: jest.fn(),
    clearCardState: jest.fn(),
    updateAddCardState: jest.fn(),
    setMessage: jest.fn()
}

const mockedAddCardMutation = {
  request: {
    query: ADD_CARD,
    variables: {
      // mock variables
      cardText:'Not test',
      columnId: '1'
    },
  },
  result: {
    data: {
      // mock response data
      addCard:{
      id:'1',
      columnId:'1',
      cardText:'Create reusable component',
      _typename:'card'
      }
    },
  },
};
const mockedAddCardMutationEmpty = {
    request: {
      query: ADD_CARD,
      variables: {
        // mock variables
        cardText:'',
        columnId: '1'
      },
    },
    result: {
      data: {
        // mock response data
      },
    },
  };
const mockedAddCardMutationError = {
    request: {
      query: ADD_CARD,
      variables: {
        // mock variables
      },
    },
    error: new Error("Network offline!")
  };
const mockedEditCardMutation = {
    request: {
      query: EDIT_CARD,
      variables: {
        // mock variables
        cardId:'32',
        updatedText: 'Not Test'
      },
    },
    result: {
      data: {
        // mock response data
      },
    },
  };
  const mockedEditCardMutationError = {
    request: {
      query: EDIT_CARD,
      variables: {
        // mock variables
      },
    },
    error: new Error('Network Offline! Cannot edit the card at this time.')
  };
const mockedClearColumnMutation = {
  request: {
    query: CLEAR_COLUMN,
    variables: {
      // mock variables
      columnId:'1'
    },
  },
  result: {
    data: {
      // mock response data
      clearColumn:{}
    },
  },
};
const mockedClearColumnMutationError = {
    request: {
      query: CLEAR_COLUMN,
      variables: {
        // mock variables
      },
    },
    error: new Error('Network offline! Cards not deleted.')
  };
const mockedRenameColumnMutation = {
    request: {
      query: RENAME_COLUMN,
      variables: {
        // mock variables
        columnId:'1',
        columnTitle: 'NotRandomTitle'
      },
    },
    result: {
      data: {
        // mock response data
        renameColumn:{
            id:'1',
            columnTitle:'NotRandomTitle',
            cards:[],
            _typename:'column'
        }
      },
    },
  };
  const mockedRenameColumnMutationError = {
    request: {
      query: RENAME_COLUMN,
      variables: {
        // mock variables
      },
    },
    error: new Error('Network Offline! Cannot rename at this time.'),
  };
const mockedDeleteColumnMutation = {
    request: {
      query: DELETE_COLUMN,
      variables: {
        // mock variables
        columnId:'1',
        columnTitle:'Test'
      },
    },
    result: {
      data: {
        // mock response data
        id:'1',
        columnTitle:'Test',
        cards:[],
        _typename:'column'
      },
    },
  };
// Mock Apollo Client mutations
const mocks = [mockedEditCardMutation, mockedAddCardMutation, 
    mockedClearColumnMutation,mockedDeleteColumnMutation, 
    mockedRenameColumnMutation,mockedRenameColumnMutationError];

it('renders ColumnList component', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ColumnComponent {...componentProps} />
    </MockedProvider>
  );
  const inputElem = screen.getByDisplayValue(componentProps.columnTitle)

  expect(inputElem.value).toBe(componentProps.columnTitle)
  // Your test assertions here
});

it('add mock function called', async () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <ColumnComponent {...componentProps} />
        </MockedProvider>
      );
      const buttonAllowlem = screen.getByText('Add Card')
      fireEvent.click(buttonAllowlem)
      const buttonAddElem = screen.getByText('Add')
      const inputElem = screen.getByLabelText('Title')
      fireEvent.change(inputElem,{target:{value:'Not test'}})
      fireEvent.click(buttonAddElem)
      await waitFor(() => {
        expect(componentProps.updateAddCardState).toHaveBeenCalled()
    })
})
it('cancel mock function called', async () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <ColumnComponent {...componentProps} />
        </MockedProvider>
      );
      const buttonAllowlem = screen.getByText('Add Card')
      fireEvent.click(buttonAllowlem)
      const buttonCancelElem = screen.getByText('Cancel')
      const inputElem = screen.getByLabelText('Title')
      fireEvent.change(inputElem,{target:{value:'Not test Worker'}})
      fireEvent.click(buttonCancelElem)
      await waitFor(() => {
        expect(inputElem.value).not.toBe('Not test Worker')
    })
})
it('add mock function called', async () => {
    render(
        <MockedProvider mocks={[mockedAddCardMutationEmpty]} addTypename={false}>
          <ColumnComponent {...componentProps} />
        </MockedProvider>
      );
      const buttonAllowlem = screen.getByText('Add Card')
      fireEvent.click(buttonAllowlem)
      const buttonAddElem = screen.getByText('Add')
      const inputElem = screen.getByLabelText('Title')
      fireEvent.change(inputElem,{target:{value:''}})
      fireEvent.click(buttonAddElem)
      await waitFor(() => {
        expect(componentProps.updateAddCardState).not.toHaveBeenCalledWith("newCard",undefined)
    })
})
it('add mock function called', async () => {
    render(
        <MockedProvider mocks={[mockedAddCardMutationError]} addTypename={false}>
          <ColumnComponent {...componentProps} />
        </MockedProvider>
      );
      const buttonAllowlem = screen.getByText('Add Card')
      fireEvent.click(buttonAllowlem)
      const buttonAddElem = screen.getByText('Add')
      const inputElem = screen.getByLabelText('Title')
      fireEvent.change(inputElem,{target:{value:'Not test'}})
      fireEvent.click(buttonAddElem)
      await waitFor(() => {
        expect(componentProps.updateAddCardState).toHaveBeenCalled()
    })
})
it('should call clearcard state function', async() => {
    const searchWord = 'Clear'
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <ColumnComponent {...componentProps} />
        </MockedProvider>
      );
    const MenuIcon = screen.getByTestId('MoreHorizSharpIcon')
    fireEvent.click(MenuIcon)
    const MenuItemlElem = screen.getByText(searchWord)
    fireEvent.click(MenuItemlElem)
    await waitFor(() => {
        expect(componentProps.clearCardState).toHaveBeenCalled()
    })
})
it('should call setMessage state function', async() => {
    const searchWord = 'Clear'
    render(
        <MockedProvider mocks={[mockedClearColumnMutationError]} addTypename={false}>
          <ColumnComponent {...componentProps} />
        </MockedProvider>
      );
    const MenuIcon = screen.getByTestId('MoreHorizSharpIcon')
    fireEvent.click(MenuIcon)
    const MenuItemlElem = screen.getByText(searchWord)
    fireEvent.click(MenuItemlElem)
    await waitFor(() => {
        expect(componentProps.setMessage).toHaveBeenCalled()
    })
})

it('should renamecolumn title', async() => {
    const searchWord = 'Rename'
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <ColumnComponent {...componentProps} />
        </MockedProvider>
      );
    const MenuIcon = screen.getByTestId('MoreHorizSharpIcon')
    fireEvent.click(MenuIcon)
    const MenuItemlElem = screen.getByText(searchWord)
    fireEvent.click(MenuItemlElem)
    const inputElem = screen.getByDisplayValue(componentProps.columnTitle)
    fireEvent.change(inputElem,{target:{value:'NotRandomTitle'}})
    const RenameButton = screen.getByTestId('rename-button')
    fireEvent.click(RenameButton)
    await waitFor(() => {
        expect(componentProps.setMessage).toHaveBeenCalled()
    })
})
it('should throw an error', async() => {
    const searchWord = 'Rename'
    render(
        <MockedProvider mocks={[mockedRenameColumnMutationError]} addTypename={false}>
          <ColumnComponent {...componentProps} />
        </MockedProvider>
      );
    const MenuIcon = screen.getByTestId('MoreHorizSharpIcon')
    fireEvent.click(MenuIcon)
    const MenuItemlElem = screen.getByText(searchWord)
    fireEvent.click(MenuItemlElem)
    const inputElem = screen.getByDisplayValue(componentProps.columnTitle)
    fireEvent.change(inputElem,{target:{value:'NotRandomTitle'}})
    const RenameButton = screen.getByTestId('rename-button')
    fireEvent.click(RenameButton)
    await waitFor(() => {
        expect(componentProps.setMessage).toHaveBeenCalled()
    })
})

it('should edit card', async() => {
    render(
        <MockedProvider mocks={[mockedEditCardMutation]} addTypename={false}>
          <ColumnComponent {...componentProps} />
        </MockedProvider>
      );
      const inputElem = screen.getByDisplayValue(componentProps.cardSet[0].cardText)
      fireEvent.doubleClick(inputElem)
      fireEvent.change(inputElem,{target:{value:'Not Test'}})
      fireEvent.mouseLeave(inputElem)
      await waitFor(() => {
        expect(componentProps.setMessage).toHaveBeenCalled()
      })
})

it('should not edit card and throw error', async() => {
    render(
        <MockedProvider mocks={[mockedEditCardMutationError]} addTypename={false}>
          <ColumnComponent {...componentProps} />
        </MockedProvider>
      );
      const inputElem = screen.getByDisplayValue(componentProps.cardSet[0].cardText)
      fireEvent.doubleClick(inputElem)
      fireEvent.change(inputElem,{target:{value:'Not Test'}})
      fireEvent.mouseLeave(inputElem)
      await waitFor(() => {
        expect(componentProps.setMessage).toHaveBeenCalled()
      })
})