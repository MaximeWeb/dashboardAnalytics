import "../styles/global.css";

export default function LeftNavBar() {
  return (
    <div className="containerLeftNavBar">
      <div className="navLeft">
        <div className="buttonLeftNav">
          <img className="icon" src="/zen.png" alt="Zen" />
        </div>
        <div className="buttonLeftNav">
          <img className="icon" src="/swim.png" alt="Swim" />
        </div>
        <div className="buttonLeftNav">
          <img className="icon" src="/velo.png" alt="Velo" />
        </div>
        <div className="buttonLeftNav">
          <img className="icon" src="/halter.png" alt="Halter" />
        </div>
      </div>
      <img className="copyrigth" src="/copyrigth.png" alt="Copyright" />
    </div>
  );
}
