import "./nav.scss";
import { FiHeart } from "react-icons/fi";
import { AiOutlineUserAdd, AiOutlineShoppingCart } from "react-icons/ai";
import { useCallback, useRef } from "react";
import { useShoeContext } from "../../contexts/shoeContext";

type Prop = {
  displayMenu: boolean;
  setDisplayMenu: React.Dispatch<React.SetStateAction<boolean>>;
};
const Nav = ({ displayMenu, setDisplayMenu }: Prop) => {
  const { setFilteredCriteria } = useShoeContext();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchKeyword = event.target.value.trim().toLowerCase();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setFilteredCriteria((prev) => ({ ...prev, keyword: searchKeyword }));
      }, 800);
    },
    [setFilteredCriteria]
  );

  return (
    <div>
      <nav>
        <div className="inner-nav">
          <div
            onClick={() => setDisplayMenu((prev) => !prev)}
            className={displayMenu ? "hamburger hamburger-active" : "hamburger"}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
          <div className="search-container">
            <input
              type="text"
              name="searchQuery"
              id="searchQuery"
              placeholder="Enter your search shoes"
              onChange={handleSearch}
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
