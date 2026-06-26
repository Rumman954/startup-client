import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/MainLayout';
import DashboardLayout from './components/dashboard/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseStartups from './pages/BrowseStartups';
import StartupDetails from './pages/StartupDetails';
import BrowseOpportunities from './pages/BrowseOpportunities';
import OpportunityDetails from './pages/OpportunityDetails';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import NotFound from './pages/NotFound';
import FounderOverview from './pages/founder/FounderOverview';
import MyStartup from './pages/founder/MyStartup';
import AddOpportunity from './pages/founder/AddOpportunity';
import ManageOpportunities from './pages/founder/ManageOpportunities';
import FounderApplications from './pages/founder/FounderApplications';
import CollaboratorOverview from './pages/collaborator/CollaboratorOverview';
import MyApplications from './pages/collaborator/MyApplications';
import AdminOverview from './pages/admin/AdminOverview';
import ManageUsers from './pages/admin/ManageUsers';
import ManageStartups from './pages/admin/ManageStartups';
import Transactions from './pages/admin/Transactions';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="startups" element={<BrowseStartups />} />
            <Route path="startups/:id" element={<StartupDetails />} />
            <Route path="opportunities" element={<BrowseOpportunities />} />
            <Route path="opportunities/:id" element={<OpportunityDetails />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="payment-success" element={<PrivateRoute roles={['founder']}><PaymentSuccess /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="founder" element={<PrivateRoute roles={['founder']}><DashboardLayout type="founder" /></PrivateRoute>}>
            <Route path="dashboard" element={<FounderOverview />} />
            <Route path="my-startup" element={<MyStartup />} />
            <Route path="add-opportunity" element={<AddOpportunity />} />
            <Route path="opportunities" element={<ManageOpportunities />} />
            <Route path="applications" element={<FounderApplications />} />
          </Route>

          <Route path="collaborator" element={<PrivateRoute roles={['collaborator']}><DashboardLayout type="collaborator" /></PrivateRoute>}>
            <Route path="dashboard" element={<CollaboratorOverview />} />
            <Route path="applications" element={<MyApplications />} />
          </Route>

          <Route path="admin" element={<PrivateRoute roles={['admin']}><DashboardLayout type="admin" /></PrivateRoute>}>
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="startups" element={<ManageStartups />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
