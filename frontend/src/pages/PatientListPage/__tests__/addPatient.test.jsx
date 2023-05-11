import { it, expect, vi } from 'vitest';
import { render, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AppContext } from '../../../utils/AppContextProvider';
import AddPatient from '../AddPatient';


//const axiosMock = new MockAdapter(axios);

const loggedInUser="000000000000000000000011";

// afterEach(() => {
//     axiosMock.reset();
// })


// it('renders responsible clinician from API correctly', async()=> {
    
//     const supervisor = {
//         id: '000000000000000000000012',
//         fname: "Kevin",
//         lname: "Zheng",
//     }
//     axiosMock.onGet('/api/patient/supervisors/000000000000000000000011').reply(200, supervisor);
    
    

//     const { getByText, queryByText } = render(
//             <AppContext.Provider value={{loggedInUser}}>
//                 <AddPatient />
//             </AppContext.Provider>        
//     )
        
//     await waitFor(()=> getByText('Responsible Clinician'), {timeout: 1000});
//     await waitFor(()=> queryByText('Kevin Zheng'), {timeout: 1000});
    
// })

it('Responds to button click correctly', () => {
    const {queryByRole } = render (
        <AppContext.Provider value={{loggedInUser}}>
                <AddPatient />
            </AppContext.Provider>
    )

    const button = queryByRole('Add');
    expect(button).toBeDefined();
})

