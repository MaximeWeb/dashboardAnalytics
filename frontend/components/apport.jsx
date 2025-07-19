import "../styles/global.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../src/main";

export default function Apport() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(`/user/${id}`)
      .then(setUser)
      .catch(err => setError(err.message));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Chargement...</p>;



  return (
    <div>
      <div className="blocinfo flex evenly">
      
          <div className="contentBloc">
            <img className="iconApport" src="/cal.png" alt="Zen" />
          </div>
          <div className="contentBloc">
            <p className="value">{user.keyData.calorieCount}kCal</p>
            <p className="apport">Calories</p>
          </div>
        </div>
      
      <div className="blocinfo flex evenly">
        <div className="contentBloc">
          <img className="iconApport" src="/proteins.png" alt="Zen" />
        </div>
        <div className="contentBloc">
          <p  className="value">{user.keyData.proteinCount}g</p>
          <p className="apport">Protèines</p>
        </div>
      </div>
      <div className="blocinfo flex evenly">
        <div className="contentBloc">
          <img className="iconApport" src="/carbs.png" alt="Zen" />
        </div>
        <div className="contentBloc">
          <p  className="value">{user.keyData.carbohydrateCount}g</p>
          <p className="apport">Glucides</p>
        </div>
      </div >
      <div className="blocinfo flex evenly">
        <div className="contentBloc">
          <img className="iconApport" src="/fat.png" alt="Zen" />
        </div>
        <div className="contentBloc">
          <p  className="value">{user.keyData.lipidCount}g</p>
          <p className="apport">Lipides</p>
        </div>
      </div>
    </div>
  );
}
