import "./nav.scss";
import { FiHeart } from "react-icons/fi";
import { AiOutlineShoppingCart, AiOutlineUserAdd } from "react-icons/ai";
import { useCallback, useRef, useContext } from "react";
import { useShoeContext } from "../../customHooks/useShoeContext.ts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Context from "../../contexts/Context.ts";

type Prop = {
  displayMenu: boolean;
  setDisplayMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const Nav = ({ displayMenu, setDisplayMenu }: Prop) => {
  const { setFilteredCriteria } = useShoeContext();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const { user } = useContext(Context)
  const coppyUser = JSON.parse(JSON.stringify(user));

  // const [cachedUser, setCachedUser] = useState<{
  //   firstName: string;
  //   lastName: string;
  //   img?: string;
  // } | null>(null);


  const localStoreUser = localStorage.getItem("user");
  let parsedUser;
  if (localStoreUser) {
    parsedUser = JSON.parse(localStoreUser);
    // setCachedUser(parsedUser);
  }



  const handleLogout = async () => {
    localStorage.removeItem("user");
    // setUser(null);
    await axios.get("http://localhost:3000/api/user/logout", {
      withCredentials: true
    });
    window.location.reload(); // Refresh to reflect logout
  };

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
    <nav className="nav-container">
      <div className="inner-nav">
        <button
          onClick={() => setDisplayMenu((prev) => !prev)}
          className={`hamburger ${displayMenu ? "hamburger-active" : ""}`}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search shoes..."
            onChange={handleSearch}
          />
        </div>

        <div className="profile-actions">
          <button className="icon-btn">
            <FiHeart />
          </button>

          <button className="icon-btn">
            <AiOutlineShoppingCart onClick={() => navigate("/cart")} />
          </button>

          {user || parsedUser ? (
            <div className="profile-dropdown">
              <button className="profile-btn" onClick={() => navigate("/profile")}>
                <img
                  src={coppyUser?.img || parsedUser?.img || "/assets/noavatar.png"}
                  alt="Profile"
                  className="profile-img"
                />
              </button>
              <div className="dropdown-menu">
                <p>{coppyUser?.firstName || parsedUser?.firstName} {coppyUser?.lastName || parsedUser?.lastName}</p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <button className="icon-btn" onClick={() => navigate("/auth")}>
              <AiOutlineUserAdd />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
