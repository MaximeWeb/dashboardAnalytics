import "../styles/global.css";

export default function topNavBar() {


  return (
    <div className='containerTopNavBar'>
      <div className="nav flex around">
        
<img className="imgTopNav" src="./public/logo.png" />
       

<p className="buttonTopNav">Accueil</p>
<p className="buttonTopNav">Profil</p>
<p className="buttonTopNav">Réglages</p>
<p className="buttonTopNav">Communauté</p>
      </div>
    </div>
  );
}