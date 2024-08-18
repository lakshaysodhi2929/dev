import { useState, ChangeEvent, FormEvent } from 'react';
import './SignIn.scss';
import { SignInParams } from '../../../../common/types';
import { userLogin } from '../../services/authService';
import { setCookie } from '../../../utils/index.ts';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [userCredentials, setUserCredentials] = useState<SignInParams>({
    username: '',
    password: ''
  });
  const navigate = useNavigate(); 

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserCredentials({
      ...userCredentials,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const loginResp = await userLogin(userCredentials);
    if(loginResp.token){
      setCookie('token', loginResp.token);
      navigate('/home');
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={userCredentials.username}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={userCredentials.password}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SignIn;
