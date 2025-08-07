const NotFound = () => {
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>Oups ! Page introuvable.</h1>
      <p>Vérifie l’URL ou retourne à la page d’accueil.</p>
      <Link to="/" style={{ textDecoration: "none", color: "blue" }}>
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFound;
