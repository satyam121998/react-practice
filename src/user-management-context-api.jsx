import React from "react";
import './user-management.css';

// create context
const UserContext = React.createContext();

// create custom hook
const useUserState = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUserState must be used in the UserProvider");
  }
  return context;
};

// create User provider
const UserProvider = ({ children }) => {
  const [searchText, setSearchText] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [displayUsers, setDisplayUsers] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize] = React.useState(5);

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

  const value = {
    searchText,
    users,
    filteredUsers,
    displayUsers,
    pageNumber,
    pageSize,

    // actions
    setSearchText,
    setUsers,
    setFilteredUsers,
    setDisplayUsers,
    setPageNumber,
    handleUserSearch
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

function SearchUsers() {
  const { setSearchText, searchText, handleUserSearch } = useUserState();
  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  React.useEffect(() => {
    // Debounce for the search
    const timeoutId = setTimeout(() => {
      if (searchText) {
        handleUserSearch(searchText);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchText, setSearchText, handleUserSearch]);

  return (
    <div>
      <span>
        <input type="text" placeholder="Search users..." onChange={handleInputChange} />
        {/* <button onClick={() => {props.handleUserSearch(props.searchText)}}>Search</button> */}
      </span>
    </div>
  );
}

function RenderUserTable() {

  const {
    searchText,
    setUsers,
    filteredUsers,
    setFilteredUsers,
    displayUsers,
    setDisplayUsers,
    pageNumber,
    setPageNumber,
    pageSize
  } = useUserState();

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  // calculation for pagination
  React.useEffect(() => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayUsers(filteredUsers.slice(startIndex, endIndex));
  }, [pageNumber, pageSize, filteredUsers, setDisplayUsers, setFilteredUsers, setPageNumber]);

  React.useEffect(() => {
    const storedUsers = localStorage.getItem('users');

    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const usersData = await response.json();
        setUsers(usersData);
        setFilteredUsers(usersData);
        localStorage.setItem('users', JSON.stringify(usersData));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (searchText === "") {
      if (storedUsers && storedUsers !== "[]") {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
        setFilteredUsers(parsedUsers);
      } else {
        fetchUsers();
      }
    }
  }, [searchText, setFilteredUsers, setUsers]);

  return (
    <div>
      <SearchUsers />
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
      <UserProvider>
        <h1>User Management</h1>
        <RenderUserTable />
      </UserProvider>
    </div>
  );
}

export default UserManagementWithContext;