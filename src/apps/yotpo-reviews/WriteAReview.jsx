import React, { useState, useEffect, useRef } from "react";

// https://apidocs.yotpo.com/reference/create-review-synchronous
const WriteAReview = () => {
  const dialogRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const ratingRef = useRef(null);
  const titleRef = useRef(null);
  const messageRef = useRef(null);

  const openDialog = () => {
    dialogRef.current.show();
    firstNameRef.current.focus();
  }

  const closeDialog = () => {
    dialogRef.current.close();
  }

  window.addEventListener('keydown', (event) => {
    if (event.keyCode === 27) dialogRef.current.close();
  });

  const submitReview = (event) => {
    event.preventDefault();
    fetch('https://api.yotpo.com/v1/widget/reviews', {
      method: 'POST',
      headers: {
        'accept': 'application/json', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appkey: window.state.yotpoAppData.apiKey,
        sku: window.state.yotpoAppData.productID,
        product_title: window.brg.product.title,
        product_url: window.location.href,
        display_name: `${firstNameRef.current.value} ${lastNameRef.current.value}`,
        email: emailRef.current.value,
        review_title: titleRef.current.value,
        review_content: messageRef.current.value,
        review_score: parseInt(ratingRef.current.value)
      })
    })
      .then((blob) => blob.json())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <div>
      <button className="button button--secondary button--short"
              onClick={() => openDialog()}>
        Write A Review
      </button>
      <dialog className="fixed inset-0 w-screen h-screen bg-transparent"
              ref={dialogRef}>
        <button className="block absolute inset-0 w-screen h-screen bg-grey-9 opacity-60"
                onClick={() => closeDialog()}></button>
        <div className="inset-0 h-screen flex justify-center items-center">
          <div className="relative px-6 py-12 w-screen max-w-[50rem] bg-white">
            <h2 className="mb-8 h4">
              Write a Review
            </h2>
            <form className="grid lg:grid-cols-2 gap-x-6 gap-y-8"
                  onSubmit={submitReview}>
              <div className="input-wrap">
                <input type="text"
                       className="w-full"
                       name="yotpo-first-name"
                       id="yotpo-first-name"
                       ref={firstNameRef} />
                <label htmlFor="yotpo-first-name">
                  First Name
                </label>
              </div>
              <div className="input-wrap">
                <input type="text"
                       className="w-full"
                       name="yotpo-last-name"
                       id="yotpo-last-name"
                       ref={lastNameRef} />
                <label htmlFor="yotpo-last-name">
                  Last Name
                </label>
              </div>
              <div className="input-wrap">
                <input type="email"
                       className="w-full"
                       name="yotpo-email"
                       id="yotpo-email"
                       ref={emailRef} />
                <label htmlFor="yotpo-email">
                  Email
                </label>
              </div>
              <div className="select-wrap">
                <select id="yotpo-rating"
                        className="w-full"
                        ref={ratingRef}>
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                </select>
                <label htmlFor="yotpo-rating">
                  Rating
                </label>
              </div>
              <div className="input-wrap col-span-2">
                <input type="text"
                       className="w-full"
                       name="yotpo-title"
                       id="yotpo-title"
                       ref={titleRef} />
                <label htmlFor="yotpo-email">
                  Review Title
                </label>
              </div>
              <div className="input-wrap col-span-2">
                <textarea type="text"
                          name="yotpo-content"
                          id="yotpo-content"
                          ref={messageRef} />
                <label htmlFor="yotpo-content">
                  Message
                </label>
              </div>
              <div>
                <button className="button button--primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default WriteAReview;