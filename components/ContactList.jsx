import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { privateAgent } from "../lib/network";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const FavouriteToggle = ({ contact, fetchContacts }) => {
  const toggleFavourite = () => {
    privateAgent
      .put(`/contact/${contact._id}`, { isFavorite: !contact.isFavorite })
      .then((res) => fetchContacts());
  };
  return (
    <button onClick={toggleFavourite}>
      <span>
        {contact?.isFavorite === true ? (
          <AiFillHeart className="w-5 h-5 text-red-500" />
        ) : (
          <AiOutlineHeart className="w-5 h-5 text-red-500" />
        )}
      </span>
    </button>
  );
};

const ContactList = ({ onSelected }) => {
  const [contacts, setContacts] = useState([]);
  const router = useRouter();

  const fetchContacts = () => {
    // fetch contacts
    privateAgent
      .get("/contact")
      .then((res) => {
        let data = res.data
        data.sort((a, b) => a.firstName < b.firstName ? -1 : a.firstName > b.firstName ? 1: 0)
        data.sort((a, b) => a.isFavorite == b.isFavorite ? 0 : a.isFavorite ? -1: 1)
        setContacts(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const onDelete = (_id) => {
    privateAgent.delete(`/contact/${_id}`).then((res) => {
      fetchContacts();
    });
  };

  if (!contacts.length) {
    return <h3 className="text-center">No contacts found.</h3>;
  } else {
    return (
      <table className="table-auto w-full border rounded-lg">
        <thead>
          <tr>
            <th classsName="px-3 py-2 text-center">Name</th>
            <th classsName="px-3 py-2 text-center">Email</th>
            <th classsName="px-3 py-2 text-center">Phone</th>
            <th classsName="px-3 py-2 text-center">Address</th>
            <th classsName="px-3 py-2 text-center">Favourite</th>
            <th classsName="px-3 py-2 text-center">Action</th>
          </tr>
        </thead>
        {contacts.length && (
          <tbody>
            {contacts.map((contact, index) => {
              return (
                <tr className="border-b hover:bg-gray-100">
                  <td className="px-3 py-2 text-center">
                    {contact.firstName} {contact.lastName}
                  </td>
                  <td className="px-3 py-2 text-center">{contact.email}</td>
                  <td className="px-3 py-2 text-center">{contact.phone}</td>
                  <td className="px-3 py-2 text-center">{contact.address}</td>
                  <td className="px-3 py-2 text-center">
                    <FavouriteToggle
                      contact={contact}
                      fetchContacts={fetchContacts}
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className=" border rounded-lg py-2 hover:border-teal-500 text-black hover:text-teal-500"
                        onClick={() => onSelected(contact)}
                      >
                        Edit
                      </button>
                      <button
                        className="hover:text-red-500 border py-2 rounded-lg text-white bg-red-500 hover:bg-white hover:border-red-500"
                        onClick={() => onDelete(contact?._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}{" "}
          </tbody>
        )}
      </table>
    );
  }
};

export default ContactList;
