import { useEffect, useState } from "react";
import Nav from "../../components/nav/Nav";
import Products from "../../components/products/Products";
import Recomended from "../../components/recomended/Recomended";
import Sidebar from "../../components/sidebar/Sidebar";
import "./home.scss";

const Home = () => {
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);

  useEffect(() => {
    if (displayMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [displayMenu]);

  return (
    <div className="home">
      <div onClick={() => setDisplayMenu(false)} className={displayMenu ? "sidebar-overlay" : ""}>
        <section
          className={!displayMenu ? "selcetion selcetion-active" : "selcetion"}
          onClick={e => e.stopPropagation()}
        >
          <Sidebar />
        </section>
      </div>
      <section className={!displayMenu ? "view view-active" : "view"}>
        <Nav displayMenu={displayMenu} setDisplayMenu={setDisplayMenu} />
        <Recomended />
        <Products />
      </section>
    </div>
  );
};

export default Home;
