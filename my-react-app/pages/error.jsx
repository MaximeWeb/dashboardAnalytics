import '../styles/global.css';
import { Link } from 'react-router-dom';



export default function Error() {

  
  return (
    <div className='errorDiv'>
     <p className='errorText'>404</p>
     <p className='errorText2'>Oups! La page que vous demandez n'existe pas.</p>
   <Link className='errorLinkHome' to="/">Retourner sur la page d'accueil</Link>
    </div>
  );
}