import React, { useState } from "react";

const EmailSignup = ({
  data: { title, content, successMessage, errorMessage, klaviyoListId },
}) => {
  const [successMessaging, setSuccessMessaging] = useState(false);
  const [errorMessaging, setErrorMessaging] = useState(false);
  const [email, setEmail] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("g", klaviyoListId);

    fetch("https:\/\/manage.kmail-lists.com/ajax/subscriptions/subscribe", {
      method: "POST",
      body: formData,
    })
      .then((blob) => blob.json())
      .then((data) => {
        if (data.success) {
          setSuccessMessaging(successMessage);
        } else {
          setErrorMessaging(true);
        }
      })
      .catch((err) => {
        setErrorMessaging(true);
        console.error(err);
      });
  };

  return (
    <div className="bg-secondary">
      <div className="px-6 py-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6">
        <div className="email-signup__info text-center lg:text-left lg:max-w-lg">
          <h3 className="text-2xl mb-4 lg:text-4xl text-white">{title}</h3>
          <div
            className="text-base text-white"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
        {successMessaging ? (
          <span className="email-signup__success text-white mx-auto">
            {successMessage}
          </span>
        ) : (
          <>
            <form
              className="email-signup__form flex flex-col gap-2 w-full"
              onSubmit={(e) => {
                handleFormSubmit(e);
              }}
            >
              <div className="flex flex-col lg:flex-row gap-4 w-full justify-center items-start">
                <input
                  name="email"
                  className="email-signup__input py-2 px-4 w-full max-w-xl"
                  type="email"
                  placeholder="Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
                <input
                  className="py-2 px-8 w-full lg:w-auto cursor-pointer"
                  type="submit"
                  value="Signup"
                />
              </div>
              {errorMessaging && (
                <span className="email-signup__error text-white">
                  {errorMessage}
                </span>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailSignup;
