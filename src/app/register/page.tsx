import { signup } from '../actions';

export default function SignupPage() {
  return (
    <form className="flex flex-col items-center p-4 bg-blue-500 justify-center ">
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <label htmlFor="username">Username:</label>
      <input id="username" name="username" type="text" />
      <button 
        formAction={signup} 
        className="bg-slate-200 text-blue-400"
      >
        Sign up
      </button>
    </form>
  )
}