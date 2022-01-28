import Head from "next/head";
import Image from "next/image";
import ContactList from "../components/ContactList";
import useStore from "../store/store";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import React, { useState } from "react";
import withAuth from "../components/withAuth";
import { privateAgent } from "../lib/network";

const Home = () => {
  const router = useRouter();
  const { logout } = useStore();
  const [newContact, setNewContact] = useState({
    _id: null,
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    isFavorite: false,
    phone: "",
  });
  const [action, setAction] = useState("add");
  const onChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (action === "add") {
      // new contact
      privateAgent
        .post("/contact", { ...newContact })
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
        });
    } else if (action === "edit") {
      // edit contact
      const { _id, ...rest } = newContact;
      privateAgent
        .put(`/contact/${_id}`, { ...rest })
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const onContactSelected = (contact) => {
    setNewContact({ ...contact });
    setAction("edit");
    window.scrollTo({ top: 0, behavior: 'smooth' })
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Contact Application</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col w-full h-full items-center justify-center">
        <div className="w-full grid grid-cols-6">
          <div className="col-span-4 col-start-2">
            <h3 className={styles.title}>
              Welcome to <a href="/">Contact Portal!</a>
            </h3>
          </div>
          <div className="place-self-center">
            <button className="text-red-500" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
        <div className="flex flex-row w-full justify-center items-center mt-4">
          <h3 className="m-2 text-3xl h-6">
            {action === "add"
              ? "Create new contact"
              : `Edit ${newContact?.firstName} ${newContact?.lastName}`}
          </h3>
        </div>
        <form
          onSubmit={onSubmit}
          className="grid grid-rows-5 gap-2"
          style={{ width: "30rem" }}
        >
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              className="p-3 border rounded-xl"
              value={newContact?.firstName}
              placeholder="First Name"
              onChange={onChange}
              name="firstName"
            />
            <input
              type="text"
              className="p-3 border rounded-xl"
              placeholder="Last Name"
              onChange={onChange}
              value={newContact?.lastName}
              name="lastName"
            />
          </div>
          {/* <div className="grid grid-rows-2"> */}
          <input
            type="text"
            className="p-3 border rounded-xl"
            placeholder="Email"
            onChange={onChange}
            value={newContact?.email}
            name="email"
          />
          <input
            type="text"
            className="p-3 border rounded-xl"
            placeholder="Phone Number"
            onChange={onChange}
            value={newContact?.phone}
            name="phone"
          />
          {/* </div> */}
          <input
            type="text"
            className="p-3 border rounded-xl w-full"
            placeholder="Address"
            onChange={onChange}
            value={newContact?.address}
            name="address"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              className="py-2 border rounded-lg hover:border-teal-500 hover:text-teal-500"
              disabled={action === "add"}
              onClick={() => {
                setAction("add");
                setNewContact({
                  _id: null,
                  firstName: "",
                  lastName: "",
                  email: "",
                  address: "",
                  isFavorite: false,
                  phone: "",
                });
              }}
            >
              Clear
            </button>
            <button
              type="submit"
              className="py-2  text-white ml-4 bg-teal-500 hover:bg-teal-400 border rounded-lg"
            >
              {action === "add" ? "Save" : "Edit"}
            </button>
          </div>
        </form>
        <div className="w-full flex justify-center mt-6 self-center object-center">
          <ContactList onSelected={onContactSelected} />
        </div>
      </main>
    </div>
  );
};

export default withAuth(Home);
