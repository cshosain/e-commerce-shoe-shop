import "./nav.scss";
import { FiHeart } from "react-icons/fi";
import { AiOutlineUserAdd, AiOutlineShoppingCart } from "react-icons/ai";

const Nav = () => {
  return (
    <div>
      <nav>
        <div className="inner-nav">
          <div className="search-container">
            <input
              type="text"
              name="searchQuery"
              id="searchQuery"
              placeholder="Enter your search shoes"
            />
          </div>
          <div className="profile-container">
            <a href="#">
              <FiHeart />
            </a>
            <a href="#">
              <AiOutlineShoppingCart />
            </a>
            <a href="#">
              <AiOutlineUserAdd />
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
