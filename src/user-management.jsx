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

  // This is handling the search for username, username or email
  const handleUserSearch = (searchText) => {
    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
    );
    setUsers(filteredUsers);
  }

  React.useEffect(() => {
    if (searchText === "") {
      if (localStorage.getItem('users')?.length > 0) {
        setUsers(JSON.parse(localStorage.getItem('users')));
      } else {
        const fetchUsers = async () => {
          try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');

            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            setUsers(await response.json());
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
            {users.map(user => (
              <tr key={user.id}>
                <td className="ellipsis">{user.id}</td>
                <td className="ellipsis">{user.name}</td>
                <td className="ellipsis">{user.username}</td>
                <td className="ellipsis">{user.email}</td>
                <td className="ellipsis">{`${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}, ${user.address.geo.lat}, ${user.address.geo.lng}`}</td>
                <td className="ellipsis">{user.phone}</td>
                <td className="ellipsis">{user.website}</td>
                <td className="ellipsis">{`${user.company.name}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserManagement() {
  return (
    <div>
      <h1>User Management</h1>
      <RenderUserTable />
    </div>
  );
}

export default UserManagement;