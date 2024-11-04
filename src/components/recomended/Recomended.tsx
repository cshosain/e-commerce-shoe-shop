import "./recomended.scss";

const Recomended = () => {
  return (
    <div className="recomended">
      <h2>Recomended</h2>
      <div className="buttons">
        <input type="button" value="All Products" />
        <input type="button" value="Nike" />
        <input type="button" value="Adidas" />
        <input type="button" value="Puma" />
        <input type="button" value="Vars" />
      </div>
    </div>
  );
};

export default Recomended;
