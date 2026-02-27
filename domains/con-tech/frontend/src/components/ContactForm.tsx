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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  return (
    /* CENTERING WRAPPER */
    <div className="min-h-screen flex justify-center items-center p-10">
      {/* FORM CONTAINER */}
      <form
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-lg
          p-6 md:p-10
          border border-white/20
          backdrop-blur-md
          text-white
          rounded-lg
        "
      >
        {/* NAME ROW */}
        <div className="flex gap-4 my-2">
          <div className="flex flex-col w-1/2">
            <label htmlFor="firstName">
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="bg-white/50 text-black rounded-sm px-2 py-1"
              required
            />
          </div>

          <div className="flex flex-col w-1/2">
            <label htmlFor="lastName">
              Last Name<span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="bg-white/50 text-black rounded-sm px-2 py-1"
              required
            />
          </div>
        </div>

        {/* EMAIL */}
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
            className="bg-white/50 text-black rounded-sm px-2 py-1"
            required
          />
        </div>

        {/* MESSAGE */}
        <div className="flex flex-col my-2">
          <label htmlFor="request">
            How can we help you?<span className="text-red-500">*</span>
          </label>
          <textarea
            id="request"
            placeholder="Your Request Here"
            rows={3}
            value={form.request}
            onChange={handleChange}
            className="bg-white/50 text-black rounded-sm px-2 py-1.5"
            required
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="
            bg-[#FFC107]/70
            text-black
            py-2
            px-6
            rounded-md
            mt-4
            hover:bg-[#FFC107]/90
            transition
          "
        >
          Submit
        </button>
      </form>
    </div>
  );
};
``
export default ContactForm;