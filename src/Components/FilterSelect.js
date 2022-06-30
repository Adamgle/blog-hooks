const FilterSelect = ({ sortMethod, setSortMethod }) => {
  return (
    <form>
      <select
        value={sortMethod}
        onChange={(e) => setSortMethod(e.target.value)}
      >
        <option value="initial">Recent</option>
        <option value="byDateOldest">Oldest</option>
        <option value="byDateLatest">Latest</option>
      </select>
    </form>
  );
};

export default FilterSelect;