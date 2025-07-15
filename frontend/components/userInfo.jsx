import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../src/main";

export default function UserInfo() {
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
    <div className="userInfo">
      <p className="nameText">
        Bonjour <span className="nameTextRed">{user.userInfos.firstName}</span>
      </p>
      <p className="infoText">Félicitation... Vous avez explosé vos objectifs hier 👏</p>
    </div>
  );
}