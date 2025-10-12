import React from "react";
import './user-management.css';


function SearchUsers(props) {

  const handleInputChange = (event) => {
    props.setSearchText(event.target.value);
  };

  React.useEffect(() => {
    // Debounce for the search
    const timeoutId = setTimeout(() => {
      if (props.searchText) {
        props.handleUserSearch(props.searchText);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [props]);

  return (
    <div>
      <span>
      <input type="text" placeholder="Search users..." onChange={handleInputChange}/>
      {/* <button onClick={() => {props.handleUserSearch(props.searchText)}}>Search</button> */}
      </span>
    </div>
  );
}

function RenderUserTable() {

  const [searchText, setSearchText] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [displayUsers, setDisplayUsers] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize] = React.useState(5);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  // calculation for pagination
  React.useEffect(() => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayUsers(filteredUsers.slice(startIndex, endIndex));
  }, [pageNumber, pageSize, filteredUsers]);

  // This is handling the search for username, username or email
  const handleUserSearch = React.useCallback((searchText) => {
    if (!searchText || searchText.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.username.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setPageNumber(1);
  }, [users]);

  React.useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (searchText === "") {
      if (storedUsers?.length > 0) {
        setUsers(JSON.parse(storedUsers));
        setFilteredUsers(JSON.parse(storedUsers));
      } else {
        const fetchUsers = async() => {
          try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');

            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            setUsers(await response.json());
            setFilteredUsers(users);
            localStorage.setItem('users', JSON.stringify(users));

          }

          catch (error) {
            console.error('Error fetching users:', error);
          }
        };

        fetchUsers();
      }
    }
  }, [users, searchText]);
  return (
    <div>
      <SearchUsers handleUserSearch={handleUserSearch} searchText={searchText} setSearchText={setSearchText}/>
      <div className="user-management-root">
        <table className="user-table">
          <thead className="table-head table-head-light">
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Company</th>
            </tr>
          </thead>
          <tbody>
            {displayUsers.length > 0 ? (
              displayUsers.map(user => (
                <tr key={user.id}>
                  <td className="ellipsis">{user.id}</td>
                  <td className="ellipsis">{user.name}</td>
                  <td className="ellipsis">{user.username}</td>
                  <td className="ellipsis">{user.email}</td>
                  <td className="ellipsis">{`${user.address.street}, ${user.address.city}`}</td>
                  <td className="ellipsis">{user.phone}</td>
                  <td className="ellipsis">{user.website}</td>
                  <td className="ellipsis">{user.company.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  {filteredUsers.length === 0 ? 'No users found' : 'Loading...'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination-controls">
        <button 
          onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
          disabled={pageNumber === 1}
        >
          Previous
        </button>
        <span>Page {pageNumber}</span>
        <button
          onClick={() => setPageNumber(prev => prev + 1)}
          disabled={pageNumber >= totalPages || filteredUsers.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function UserManagementWithContext() {
  return (
    <div>
      <h1>User Management</h1>
      <RenderUserTable />
    </div>
  );
}

export default UserManagementWithContext;