import './ScoreBoard.css'

function Table (props) {
    const { gameData, personal } = props
    return (
        <table>
            <TableHeader personal={personal} />
            <TableBody gameData={gameData} personal={personal} />
        </table>
    )
}

//functional component for table headings
function TableHeader(props) {
    return (
      <thead>
        <tr>
          <th>Ranking</th>
          {!props.personal && <th>Username</th>}
          {!props.personal && <th>Country</th>}
          <th>Score</th>
          <th>Date</th>
        </tr>
      </thead>
    )
}

//functional component for displaying the table data rows
function TableBody(props) {
    const rows = props.gameData.map((row, index) => {
        return (
            <tr key={index}>
                <td>{ row.ranking }</td>
                {!props.personal && <td>{ row.username }</td>}
                {!props.personal && <td>{ row.country }</td>}
                <td>{ row.score }</td>
                <td>{ (new Date(row.created_at)).toLocaleDateString() }</td>
            </tr>
        )
    })
    return (
        <tbody>{ rows }</tbody>
    )
}

export default Table