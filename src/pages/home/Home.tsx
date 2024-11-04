import Nav from "../../components/nav/Nav";
import Products from "../../components/products/Products";
import Recomended from "../../components/recomended/Recomended";
import Sidebar from "../../components/sidebar/Sidebar";
import "./home.scss";

const Home = () => {
  return (
    <div className="home">
      <section className="selcetion">
        <Sidebar />
      </section>
      <section className="view">
        <Nav />
        <Recomended />
        <Products />
      </section>
    </div>
  );
};

export default Home;
