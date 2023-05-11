import { it, expect, afterEach } from 'vitest';
import { getAllByAltText, getAllByLabelText, getAllByRole, getByDisplayValue, getByTestId, render, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { useContext } from 'react';
import { AppContextProvider, AppContext } from '../utils/AppContextProvider'
import Notifications from '../pages/NotificationsPage/Notification';

const axiosMock = new MockAdapter(axios);

afterEach(() => {
    axiosMock.reset();
})
it('renders notification from API correctly', async () => {

    const notifications = [
        {
            _id: '000000000000000000000041',
            type: 'Admin',
            recipient: '000000000000000000000011',
            patient: '000000000000000000000001',
            entity: 'You have a new patient',
            isRead: false,
            created_at: '2023-05-06T00:00:00.000Z',
        },
        {
            _id: '000000000000000000000042',
            type: 'Task',
            recipient: '000000000000000000000012',
            patient: '000000000000000000000002',
            entity: 'Blood test needed for',
            isRead: true,
            created_at: '2023-05-07T00:00:00.000Z',
        }
    ];
    axiosMock.onGet('/api/notification').reply(200, notifications);


    // Render component under test (AppContextProvider), with a TestComponent we can use to
    // see its output.
    const { queryByText, getByRole, getByText, queryByRole } = render(
        <AppContextProvider>
            <Notifications />
        </AppContextProvider>
    )

    const button = queryByRole('Notification');

    // Make sure each notification is rendered
    for (let notification of notifications) {
        expect(queryByText(notification._id)).toBeDefined();
        expect(queryByText(notification.type)).toBeDefined();
        expect(queryByText(notification.recipient)).toBeDefined();
        expect(queryByText(notification.patient)).toBeDefined();
        expect(queryByText(notification.entity)).toBeDefined();
        expect(queryByText(notification.isRead)).toBeDefined();
        expect(queryByText(notification.created_at)).toBeDefined();
    }
})
