import { useState, ChangeEvent, FormEvent } from "react";

interface ContactFormState {
  firstName: string;
  lastName: string;
  email: string;
  request: string;
}

const ContactForm = () => {
  const [form, setForm] = useState<ContactFormState>({
    firstName: "",
    lastName: "",
    email: "",
    request: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // Add your submission logic here (e.g., API call)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 md:p-10 pb-0 border-[0.1px] border-white backdrop-blur-md md:w-2/5 text-white"
    >
      <div className="flex justify-between my-2">
        <div className="flex flex-col w-5/12">
          <label htmlFor="firstName">
            First Name<span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="bg-white/50 rounded-sm w-full px-2 py-1"
            required
          />
        </div>
        <div className="flex flex-col w-5/12">
          <label htmlFor="lastName">
            Last Name<span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="bg-white/50 rounded-sm md:w-full px-2 py-1"
            required
          />
        </div>
      </div>

      <div className="flex flex-col my-2">
        <label htmlFor="email">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          className="bg-white/50 rounded-sm w-[65%] px-2 py-1"
          required
        />
      </div>

      <div className="flex flex-col my-2">
        <label htmlFor="request">
          How can we help you?<span className="text-red-500">*</span>
        </label>
        <textarea
          id="request"
          placeholder="Your Request Here"
          rows={2}
          value={form.request}
          onChange={handleChange}
          className="bg-white/50 rounded-sm w-[70%] px-2 py-1.5"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-[#FFC107]/70 text-black py-2 px-6 rounded-md my-2 hover:bg-[#FFC107]/90 transition duration-300"
      >
        Submit
      </button>
    </form>
  );
};

export default ContactForm;
