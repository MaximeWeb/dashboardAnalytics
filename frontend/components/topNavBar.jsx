import "../styles/global.css";

export default function topNavBar() {


  return (
    <div className='containerTopNavBar'>
      <div className="nav flex between">
        

<img className="imgTopNav" src="/logo.png" alt="logo" />
       

<p className="buttonTopNav">Accueil</p>
<p className="buttonTopNav">Profil</p>
<p className="buttonTopNav">Réglages</p>
<p className="buttonTopNav">Communauté</p>
      </div>
    </div>
  );
}