import { login } from '../actions';

export default function LoginPage() {
  return (
    <form className="flex flex-col items-center p-4 bg-blue-500 justify-center ">
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button 
        formAction={login} 
        className="bg-slate-200 text-blue-400"
      >
        Log in
      </button>
    </form>
  )
}
