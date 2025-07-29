import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'


import PageLogin from "./pages/pagelogin"
import PageAdmin from "./pages/pageadmin"
import PageMedecin from "./pages/pagemedecin"
import Adminroute from './pages/adminrouter'
import ProtectedRoute from './composants/protectedroute'
import RoleBasedRoute from './composants/rolebasedroute'
import Medecinroute from './pages/medecinrouter'
import Calendrier from './composants/calendar'
import Secretaireroute from './pages/secretaireroute'





function App() {
  
   return(<>
   <Router>
      <Routes>
        <Route path="/" element={<PageLogin/>} />
        <Route path="/calendar" element={<Calendrier/>} />
        <Route path="/pagemedecin" element={<PageMedecin/>} />
        <Route element={<ProtectedRoute/>}>

            {/* Routes protégées avec contrôle de rôle */}
            <Route element={<RoleBasedRoute allowedRoles={['ROLE_ADMIN']} />}>
              {/*<Route path='/admin/*' element={<Adminroute/>}/>*/}
              {Adminroute()}
            </Route>
            <Route element={<RoleBasedRoute allowedRoles={['ROLE_MEDECIN']} />}>
              {/*<Route path='/admin/*' element={<Adminroute/>}/>*/}
              {Medecinroute()}
            </Route>
            <Route element={<RoleBasedRoute allowedRoles={['ROLE_SECRETAIRE']} />}>
              {/*<Route path='/admin/*' element={<Adminroute/>}/>*/}
              {Secretaireroute()}
            </Route>
      </Route>
      </Routes>
    </Router>
   </>)
  
}

export default App
