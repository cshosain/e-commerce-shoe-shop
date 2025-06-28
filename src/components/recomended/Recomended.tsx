import { useState } from "react";
import { useShoeContext } from "../../customHooks/useShoeContext.ts";
import "./recomended.scss";

type SelectedBtn = string;

const Recomended = () => {
  const { setFilteredCriteria } = useShoeContext();
  const [selectedBtn, setSelectedBtn] = useState<SelectedBtn>('0');
  const handleBrandBtn = (event: React.MouseEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSelectedBtn(event.currentTarget.id);
    setFilteredCriteria((prevCriteria) => ({
      ...prevCriteria,
      brand: value === "All Products" ? "All" : value,
    }));
  };

  return (
    <div className={"recomended"}>
      <h2 className="recomended-head">Recomended</h2>
      <div className="buttons">
        <input
          className={selectedBtn === "0" ? "active" : ""}
          type="button"
          id="0"
          disabled={selectedBtn === "0"}
          onClick={handleBrandBtn}
          value="All Products"
        />
        <input
          className={selectedBtn === "1" ? "active" : ""}
          type="button"
          id="1"
          disabled={selectedBtn === "1"}
          onClick={handleBrandBtn}
          value="Nike"
        />
        <input
          className={selectedBtn === "2" ? "active" : ""}
          type="button"
          id="2"
          disabled={selectedBtn === "2"}
          onClick={handleBrandBtn}
          value="Adidas"
        />
        <input
          className={selectedBtn === "3" ? "active" : ""}
          type="button"
          id="3"
          disabled={selectedBtn === "3"}
          onClick={handleBrandBtn}
          value="Puma"
        />
        <input
          className={selectedBtn === "4" ? "active" : ""}
          style={{ backgroundColor: selectedBtn[4] ? "green" : "" }}
          type="button"
          id="4"
          disabled={selectedBtn === "4"}
          onClick={handleBrandBtn}
          value="Vars"
        />
      </div>
    </div>
  );
};

export default Recomended;
