import { useState } from "react";
import Nav from "../../components/nav/Nav";
import Products from "../../components/products/Products";
import Recomended from "../../components/recomended/Recomended";
import Sidebar from "../../components/sidebar/Sidebar";
import "./home.scss";

const Home = () => {
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);

  return (
    <div className="home">
      <section
        className={!displayMenu ? "selcetion selcetion-active" : "selcetion"}
      >
        <Sidebar />
      </section>
      <section className="view">
        <Nav displayMenu={displayMenu} setDisplayMenu={setDisplayMenu} />
        <Recomended displayMenu={displayMenu} />
        <Products displayMenu={displayMenu} />
      </section>
    </div>
  );
};

export default Home;
