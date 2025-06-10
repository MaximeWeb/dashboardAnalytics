import "../styles/global.css";

export default function leftNavBar() {
  return (
    <div className="containerLeftNavBar">
      <div className="navLeft">
        <div className="buttonLeftNav">
          <img className="icon" src="./public/zen.png" />
        </div>
        <div className="buttonLeftNav">
          <img className="icon" src="./public/swim.png" />
        </div>
        <div className="buttonLeftNav">
          <img className="icon" src="./public/velo.png" />
        </div>
        <div className="buttonLeftNav">
          <img className="icon" src="./public/halter.png" />
        </div>
      </div>
     <img className="copyrigth" src="./public/copyrigth.png" />
    </div>
  );
}
