import './App.css';
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from './pages/LoginPage/LoginPage'
import MyProfile from './pages/MyProfilePage/MyProfile';
import MyTeam from './pages/MyTeamPage/MyTeam';
import PatientList from './pages/PatientListPage/PatientInfoTab';
import Notifications from './pages/NotificationsPage/Notification';
import PageWithNavbar from "./pages/PageWithNavBar";
import PatientListGrid from "./pages/PatientDetailsPage/PatientListGrid";
import { PageNotFound } from './ErrorPage.jsx';


function App() {
  return (
    
    <Routes>
      <Route path="/" element={<PageWithNavbar />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path='login' element={< LoginPage />}/>
          <Route path='notification' element={< Notifications />}/>
          <Route path='myteam' element={< MyTeam />}/>
          <Route path='myprofile' element={< MyProfile />}/>
          <Route path='patientlist' element={< PatientList />}/>
          <Route path='patientdetails/:patientId' element={<PatientListGrid />}/>

          //if nothing matches, show error page
          <Route path='*' element={<PageNotFound/>}/>

      </Route>
    </Routes>
  );
}

export default App;
