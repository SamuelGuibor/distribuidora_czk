export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Filtrar por</h3>
      <div className="filter">
        <h4>Categoria</h4>
        <label><input type="radio" name="categoria" value="alcoholic" defaultChecked /> Alcoólicas</label>
        <label><input type="radio" name="categoria" value="non-alcoholic" /> Não Alcoólicas</label>
        <label><input type="radio" name="categoria" value="snacks" /> Snacks</label>
        <label><input type="radio" name="categoria" value="desserts" /> Sobremesas</label>
      </div>
      <div className="filter">
        <h4>Preço</h4>
        <input type="range" min="0" max="2000" step="1" />
        <div>R$ 0 - R$ 2000</div>
      </div>
      <div className="filter">
        <h4>Marca</h4>
        <label><input type="checkbox" name="marca" value="marca1" /> Marca 1</label>
        <label><input type="checkbox" name="marca" value="marca2" /> Marca 2</label>
        <label><input type="checkbox" name="marca" value="marca3" /> Marca 3</label>
        <label><input type="checkbox" name="marca" value="marca4" /> Marca 4</label>
      </div>
    </aside>
  );
}
