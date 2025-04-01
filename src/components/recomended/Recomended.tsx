import { useState } from "react";
import { useShoeContext } from "../../contexts/shoeContext";
import "./recomended.scss";

type BtnIds = boolean[];
type Prop = {
  displayMenu: boolean;
};

const Recomended = ({ displayMenu }: Prop) => {
  const { setFilteredCriteria } = useShoeContext();
  const [btnIds, setBtnIds] = useState<BtnIds>([
    true,
    false,
    false,
    false,
    false,
  ]);
  const handleBrandBtn = (event: React.MouseEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const id = parseInt(event.currentTarget.id);
    setBtnIds([false, false, false, false, false]);
    setBtnIds((prev) => [...prev, (prev[id] = true)]);
    setFilteredCriteria((prevCriteria) => ({
      ...prevCriteria,
      brand: value === "All Products" ? "All" : value,
    }));
  };

  return (
    <div className={displayMenu ? "recomended recom-invisible" : "recomended"}>
      <h2 className="recomended-head">Recomended</h2>
      <div className="buttons">
        <input
          className={btnIds[0] ? "active" : ""}
          type="button"
          id="0"
          disabled={btnIds[0]}
          onClick={handleBrandBtn}
          value="All Products"
        />
        <input
          className={btnIds[1] ? "active" : ""}
          type="button"
          id="1"
          disabled={btnIds[1]}
          onClick={handleBrandBtn}
          value="Nike"
        />
        <input
          className={btnIds[2] ? "active" : ""}
          type="button"
          id="2"
          disabled={btnIds[2]}
          onClick={handleBrandBtn}
          value="Adidas"
        />
        <input
          className={btnIds[3] ? "active" : ""}
          type="button"
          id="3"
          disabled={btnIds[3]}
          onClick={handleBrandBtn}
          value="Puma"
        />
        <input
          className={btnIds[4] ? "active" : ""}
          style={{ backgroundColor: btnIds[4] ? "green" : "" }}
          type="button"
          id="4"
          disabled={btnIds[4]}
          onClick={handleBrandBtn}
          value="Vars"
        />
      </div>
    </div>
  );
};

export default Recomended;
