import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect, useState } from 'react'
import { User } from './types/user';

type Props = {
  id?: number,
  name: string,
}

const fetchUsers = async() => {
  const usersData = await fetch('/api/users');
  const usersJson = usersData.json();
  return usersJson;
}

function UserItem({ name }: Props) {
  return(
    <li>{name}</li>
  )
}


export default function Users() {
  const [inputText, setInputText] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers()
      .then(res => {
        const newUsers: User[] = [...res.users];
        setUsers(newUsers);
        console.log(newUsers);
      })
      .catch(err => console.log(err));
  }, []);

  const hundleSubmit = (e: 	React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const newUser: User = {
      name: inputText,
    }

    setUsers([...users, newUser]);
    setInputText('');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputText(e.target.value);
  }

  return (
    <>
      <div className='App'>
        <ul>
          {
            users.map((user: User) => {
              return <UserItem key={user.name} name={user.name}/>;
            })
          }
        </ul>

        <form onSubmit={hundleSubmit}>
          <input type="text" onChange={handleChange} value={inputText}/>
          <button type='submit'>追加</button>
        </form>
      </div>

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
    </>
  )
}
