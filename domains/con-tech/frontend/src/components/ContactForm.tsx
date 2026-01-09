import { useState } from "react";

const ContactForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    request: "",
  });
  return (
    <form className="p-4 md:p-10 pb-0 border-[0.1px] border-white backdrop-blur-md md:w-2/5 text-white">
      <div className="flex justify-between my-2">
        <div className="flex flex-col w-5/12">
          <label htmlFor="first-name">
            First Name<span className="text-red-500">*</span>
          </label>
          <input
            id="first-name"
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => {
              setForm({ ...form, firstName: e.target.value });
            }}
            className="bg-white/50 rounded-sm w-full px-2 py-1"
          />
        </div>
        <div className="flex flex-col w-5/12">
          <label htmlFor="last-name">
            Last Name<span className="text-red-500">*</span>
          </label>
          <input
            id="last-name"
            type="text"
            placeholder="Last Name"
            className="bg-white/50 rounded-sm md:w-full px-2 py-1"
            value={form.lastName}
            onChange={(e) => {
              setForm({ ...form, lastName: e.target.value });
            }}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="email">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          required={true}
          id="email"
          type="email"
          placeholder="Your Email"
          className="bg-white/50 rounded-sm w-[65%] px-2 py-1"
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
          }}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="request">
          How can We help you?<span className="text-red-500">*</span>
        </label>
        <textarea
          required={true}
          id="request"
          placeholder="Your Request Here"
          rows={2}
          className="bg-white/50 rounded-sm w-[70%] px-2 py-1.5"
          value={form.request}
          onChange={(e) => {
            setForm({ ...form, request: e.target.value });
          }}
        />
      </div>
      <button type="submit" className="bg-[#FFC107]/70 text-black py-2 px-6 rounded-md my-2 hover:bg-[#FFC107]/90 transition duration-300">Submit</button>
    </form>
  );
};
export default ContactForm;
