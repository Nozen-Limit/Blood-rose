/* A data table, wrapped so it can scroll sideways on phones rather than
   squashing or forcing the page to scroll horizontally. */
export default function DataTable({
  columns, rows,
}: { columns: string[]; rows: string[][] }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>{columns.map((label) => <th key={label}>{label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i}>
              {cells.map((value, j) => <td key={j}>{value}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
