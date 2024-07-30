import Header from "./Header/Header";

import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Footer from "./Footer/Footer";
import Navbar from "./Navbar/Navbar";
import NotFound from "./Routes/NotFound";
import Staff from "./Routes/Staff";
import Login from "./Routes/Login";
import LoginRole from "./Routes/LoginRole";


import ProtectedRoute from "./Routes/ProtectedRoute";
import EntityList from "./Routes/EntityList";
import { House } from "../../@types/house";
import { Classe } from "../../@types/classe";
import { Wizard } from "../../@types/wizard";
import { formatDate, formatDateInput } from "../../utils/formatDate";
import { Subject } from "../../@types/subject";
import { RoleType } from "../../@types/role";
import { Room } from "../../@types/room"

const App: React.FC = () => {
  const location = useLocation();
  const hideHeader = location.pathname === "/login" || location.pathname === "/login-role";

  return (
    <div className="app">
      {!hideHeader && <Header />}
      {!hideHeader && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/staff" />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/subjects" element={<EntityList entrypoint="/subjects" renderEntity={(subject: Subject) => <>
          <label>Description</label>
          <p>{subject.description}</p></>} renderFormEntity={(entity, handleChange) =>
            <>
              <label>Nom de la matière : </label>
              <input type="text" name="name" value={entity.name} onChange={handleChange} />
              <label>Description de la matière : </label>
              <textarea name="description" value={entity.description} cols={30} rows={10} />


            </>
          } />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-role" element={<LoginRole />} />
        <Route path="/wizards" element={<ProtectedRoute><EntityList entrypoint="/wizards" renderEntity={(wizard: Wizard) => <>
          <p>{formatDate(wizard.birthdate)}</p>
          <p>{wizard.email}</p></>} renderFormEntity={(entity, handleChange) =>
            <>
              <label>Nom du sorcier : </label>
              <input type="text" name="lastname" value={entity.lastname} onChange={handleChange} />
              <label>Prénom du sorcier : </label>
              <input type="text" name="firstname" value={entity.firstname} onChange={handleChange} />
              <label>Date de naissance : </label>
              <input type="date" name="birthdate" value={formatDateInput(entity.birthdate)} onChange={handleChange} />
              <label>Email : </label>
              <input type="email" name="email" value={entity.email} onChange={handleChange} />


            </>
          }
        /></ProtectedRoute>} />
        <Route path="/classes" element={<ProtectedRoute><EntityList entrypoint="/classes" renderEntity={(classe: Classe) => <>
          <p>étage:{classe.level}</p></>} renderFormEntity={(entity, handleChange) =>
            <>
              <label>Nom de la classe : </label>
              <input type="text" name="name" value={entity.name} onChange={handleChange} />
              <label>Niveau de la classe : </label>
              <input type="number" name="level" value={entity.level} onChange={handleChange} />
            </>
          } /></ProtectedRoute>} />
        <Route path="/houses" element={<ProtectedRoute><EntityList entrypoint="/houses" renderEntity={(house: House) => <><p>bâtiment:{house.building}</p>
          <p>étage:{house.floor}</p></>} renderFormEntity={(entity, handleChange) =>
            <>
              <label>Nom de la maison : </label>
              <input type="text" name="name" value={entity.name} onChange={handleChange} />
              <label>Bâtiment : </label>
              <input type="text" name="level" value={entity.building} onChange={handleChange} />
              <label>Etage : </label>
              <input type="number" name="level" value={entity.floor} onChange={handleChange} />

            </>
          } /></ProtectedRoute>} />
        <Route path="/rooms" element={<ProtectedRoute><EntityList entrypoint="/rooms" renderEntity={(room: Room) => <><p>bâtiment:{room.building}</p>
          <p>étage:{room.floor}</p></>} renderFormEntity={(entity, handleChange) =>
            <>
              <label>Nom de la salle : </label>
              <input type="text" name="name" value={entity.name} onChange={handleChange} />
              <label>Bâtiment : </label>
              <input type="text" name="level" value={entity.building} onChange={handleChange} />
              <label>Etage : </label>
              <input type="number" name="level" value={entity.floor} onChange={handleChange} />
              <label>Capacité : </label>
              <input type="number" name="level" value={entity.capacity} onChange={handleChange} />
              <label>Classe : </label>
              <input type="text" name="level" value={entity.number} onChange={handleChange} />

            </>
          } /></ProtectedRoute>} />
        <Route path="/roles" element={<ProtectedRoute><EntityList entrypoint="/roles" renderEntity={(role: RoleType) => <>
          <p>Administrateur : {role.is_staff ? "✅" : "❌"}</p></>} renderFormEntity={(entity, handleChange) =>
            <>
              <label>Nom du rôle : </label>
              <input type="text" name="name" value={entity.name} onChange={handleChange} />
              <label>Administrateur : </label>
              <input type="checkbox" name="is_staff" value={entity.is_staff ? "true" : "false"} checked={entity.is_staff} onChange={handleChange} />

            </>
          } /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
