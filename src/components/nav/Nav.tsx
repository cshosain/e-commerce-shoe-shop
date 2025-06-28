import "./nav.scss";
import { FiHeart } from "react-icons/fi";
import { AiOutlineShoppingCart, AiOutlineUserAdd } from "react-icons/ai";
import { useCallback, useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Context from "../../contexts/Context.ts";
import { ShoeContext } from "../../contexts/shoeContext";

type Prop = {
  displayMenu: boolean;
  setDisplayMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const Nav = ({ displayMenu, setDisplayMenu }: Prop) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const shoeContext = useContext(ShoeContext);
  const setFilteredCriteria = shoeContext?.setFilteredCriteria;
  const windowSize = window.innerWidth;

  const coppyUser = JSON.parse(JSON.stringify(user));
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const localStoreUser = localStorage.getItem("user");
  let parsedUser;
  if (localStoreUser) {
    parsedUser = JSON.parse(localStoreUser);
  }

  // --- Search state for results ---
  const [searchResults, setSearchResults] = useState<{ _id: string; title: string }[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get(`${baseUrl}/api/user/logout`, {
        withCredentials: true
      });
      localStorage.removeItem("user");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchKeyword = event.target.value.trim();
      setSearchValue(event.target.value);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!searchKeyword) {
        setSearchResults([]);
        setSearchLoading(false);
        setShowDropdown(false);
        return;
      }

      setShowDropdown(true);

      timeoutRef.current = setTimeout(async () => {
        setSearchLoading(true);
        try {
          const response = await axios.get(
            `${baseUrl}/api/shoes/paginated?limit=10&page=1&keyword=${searchKeyword}`
          );
          setSearchResults(response.data.data || []);
        } catch (err) {
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, 400);
    },
    [baseUrl]
  );

  // Handle blur for hiding dropdown
  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150); // Delay to allow click
  };

  // Handle search button click
  const handleSearchButton = () => {
    if (setFilteredCriteria) {
      setFilteredCriteria((prev) => ({
        ...prev,
        keyword: searchValue.trim(),
      }));

    }
    setShowDropdown(false);
    setSearchResults([]);
    // Optionally clear input: setSearchValue("");
  };

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
            value={searchValue}
            onChange={handleSearch}
            onFocus={() => setShowDropdown(true)}
            onBlur={handleBlur}
          />
          {/* when window size is small and showDropdown is flase then hide the search-btn*/}
          <button
            style={{ display: (windowSize <= 480) && !showDropdown ? "none" : "block" }}
            className="search-btn"
            onClick={handleSearchButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          {showDropdown && (
            <div
              className="search-result"
              onMouseDown={e => e.preventDefault()} // Prevent blur on click
            >
              {searchLoading && <div className="search-loading">Loading...</div>}
              {!searchLoading && searchResults.length > 0 && (
                <ul>
                  {searchResults.map((result) => (
                    <li
                      key={result._id}
                      className="search-item"
                      onClick={() => {
                        setShowDropdown(false);
                        setSearchResults([]);
                        navigate(`/product/${result._id}`);
                      }}
                    >
                      {result.title}
                    </li>
                  ))}
                </ul>
              )}
              {!searchLoading && searchResults.length === 0 && searchValue.trim() && (
                <div className="no-result">No results</div>
              )}
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button className="icon-btn">
            <FiHeart onClick={() => navigate("./orders")} />
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
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}>Logout</button>
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
