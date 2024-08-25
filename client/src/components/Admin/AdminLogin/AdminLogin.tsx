import { useState, ChangeEvent, FormEvent } from 'react';
import './adminLogin.scss';
import { SignInParams } from '../../../../../common/types/index.ts';
import { setCookie } from '../../../../utils/index.ts';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../../services/adminServices/loginService.ts';

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
    const loginResp = await adminLogin(userCredentials);
    if(loginResp.token){
      setCookie('token', loginResp.token);
      navigate('/admin/orderList');
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
