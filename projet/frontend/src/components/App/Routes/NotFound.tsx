import "./NotFound.scss";
import React from "react";

const NotFound: React.FC = () => {
  return (
    <main className="notfound">
      <h1>404 - Page non trouvée</h1>
      <p>Désolé, la page que vous recherchez n'existe pas.</p>
    </main>
  );
};

export default NotFound;
