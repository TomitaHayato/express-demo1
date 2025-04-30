import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Users from "./Users";

function Top() {
  return(
    <div>
      <h1>Top Page</h1>
    </div>
  )
}

export default function App() {
  return(
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to='/'>Top</Link></li>
            <li><Link to='/users'>Users</Link></li>
          </ul>
        </nav>
      </div>
      <Routes>
        <Route path='/users' element={<Users />}/>
        <Route path='/' element={<Top />}/>
      </Routes>
    </Router>
  )
}
