import { useState, ChangeEvent, FormEvent } from 'react';
import './SignUp.scss';
import { SignUpParams } from '../../../../common/types';
import { userSignUp } from '../../services/authService';
import { setCookie } from '../../../utils/index.ts';

const SignUp = () => {
  const [userCredentials, setUserCredentials] = useState<SignUpParams>({
    username: '',
    password: '',
    phoneNumber: '',
    address: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserCredentials({
      ...userCredentials,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const signUpResp = await userSignUp(userCredentials);
    setCookie('token', signUpResp.token);
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
      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={userCredentials.phoneNumber}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address:</label>
        <textarea
          id="address"
          name="address"
          value={userCredentials.address}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SignUp;
