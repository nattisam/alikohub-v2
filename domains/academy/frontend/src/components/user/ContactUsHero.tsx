import heroImage from "../../assets/bgo.png"
import balls from "../../assets/Frame2.png"

export default function Hero() {
  return (
    <section className="relative w-screen h-screen overflow-hidden bg-white text-white flex items-center justify-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-65"
        style={{ backgroundImage: `url(${heroImage})` }}
      >

                <div className="flex w-full h-full pt-15">
            {/* Left side */}
            <div className="flex flex-col justify-center items-center w-1/2 h-full pb-20">
                <div
                className="bg-center ml-55 bg-no-repeat bg-contain w-85 h-85 flex items-center justify-center font-bold text-black text-[3.4rem] pt-5 "
                style={{ backgroundImage: `url(${balls})`,  opacity: 0.4  }}
                >
              Contact Us
                
                </div>
                 <p className="text-xl text-black text-left pl-40">
              Need to get in touch with us? You can either fill out the form
              elit sed diam nonummy nibh.
            </p>
            </div>

            {/* Right side */}
            <div className=" w-1/2 h-full"></div>
            <div className="flex justify-center items-center w-1/2 h-full mr-45 pb-20">
                <div
                className="w-130 h-100 bg-white rounded-lg flex flex-col items-center justify-center  p-8"
                  style={{ boxShadow: '0 0 40px rgba(0, 0, 0, 0.33)' }}

                >

    <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Us</h2>

            <form className="w-full">
              {/* First Name & Last Name Fields. Uses a responsive grid for a clean layout. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    First name*
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Last name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              {/* Help Text Area */}
              <div className="mb-6">
                <label htmlFor="help" className="block text-sm font-medium text-gray-700 mb-1">
                  What can we help you with?
                </label>
                <textarea
                  id="help"
                  name="help"
                
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-yellow-400 text-gray-800 font-bold rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
                    
                
                </div>
            </div>

            </div>


      </div>

      
    </section>
  );
}
