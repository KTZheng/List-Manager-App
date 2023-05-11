import { it, expect } from 'vitest';
import { render} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AppContextProvider, AppContext } from '../utils/AppContextProvider'
import Overview from '../pages/PatientListPage/OverviewPage/Overview';

const axiosMock = new MockAdapter(axios);

it('renders overview with context correctly', () => {

    const { queryByRole } = render(
        <AppContextProvider>
            <Overview />
        </AppContextProvider>
    )

    const addButton = queryByRole('Add');
    const editButton = queryByRole('Edit');

    expect(addButton).toBeDefined()
    expect(editButton).toBeDefined()

})