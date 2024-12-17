import { signup } from '../actions';

export default function SignupPage() {
  return (

    <form className={`signup-form flex flex-col items-center justify-center p t-96`}>
      <div className='ml-2 mt-36 mb-48'>
        {/* <label htmlFor="username" 
          className="text-white"
        >
          Username:
        </label> */}
        <input id="username" name="username" type="text" className='bg-black text-white w-20 h-14' placeholder='Username'/>
      </div>

      <section className="flex gap-4 mb-6 px-10 justify-evenly ">
        <div>
          {/* <label htmlFor="email" 
            className=" text-white"        
          >
            Email:
          </label> */}
          <input id="email" name="email" type="email" required placeholder="Email" className='bg-black text-white w-20'/>
        </div>

        <button 
          formAction={signup} 
          className="bg-black text-white ring-white border-2 p-2"
        >
          Register
        </button>

        <div>
          {/* <label htmlFor="password" 
            className=" text-white"
          >
            Password:
          </label> */}
          <input id="password" name="password" type="password" required placeholder='Password' className='text-white bg-black w-20'/>
        </div>
      </section>
        
      
    </form>
  )
}