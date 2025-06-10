import UserInfo from "../components/userInfo";
import Poid from "../components/poid";
import Objectifs from "../components/objectifs";
import Radar from "../components/radar";
import Kpi from "../components/kpi";
import Apport from "../components/apport";
import "../styles/global.css";

export default function Home() {
  return (
    <div className="home">
      <div className="div1">
         <UserInfo />
      </div>
     
      <div className="flex">
        <div>
          <div className="div2">
                <Poid />
          </div>
      
          <div className="flex div3">
            <div className="blocDiv3">
              <Objectifs />
            </div>
            <div className="blocDiv3">
               <Radar />
            </div>
           <div className="blocDiv3">
             <Kpi />
           </div>
           
          </div>
        </div>

        <div className="div4">
          <Apport />
        </div>
      </div>
    </div>
  );
}
