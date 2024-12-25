import { useRef, useState } from "react";
// import useUserStore from "../store/user.store";

import { Link } from "react-router-dom";
import { useUserContext } from "../context/AppContext";
const ProfilePage = () => {
  const fileRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showListingError, setShowListingError] = useState(false);
  const [listings, setListings] = useState([]);
  const {
    currentUser,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutUserStart,
    signOutUserSuccess,
    signOutUserFailure,
  } = useUserContext();
  const [updatedData, setUpdatedData] = useState({});

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "test-mern-project");
    formData.append("api_key", "599582733417938");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dpuanuspp/image/upload",
        {
          method: "POST",
          body: formData,
        }
      ).then((r) => r.json());

      setImageUrl(res.url); // Update the image preview
      setUpdatedData((prevData) => ({ ...prevData, avatar: res.url })); // Use res.url directly
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.id]: e.target.value });
  };

  // Save changes to the database
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      updateUserStart();
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!data) {
        updateUserFailure(data.message);
        return;
      }

      updateUserSuccess(data);
    } catch (error) {
      updateUserFailure(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      deleteUserStart();

      if (!currentUser || !currentUser._id) {
        deleteUserFailure("User is not defined or missing ID");
        return;
      }

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        if (data && data.message) {
          deleteUserFailure(data.message);
          return;
        }

        deleteUserSuccess(data);
      }
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete user");
    } catch (error) {
      deleteUserFailure(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      signOutUserStart();
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        signOutUserFailure(data.message);
        return;
      }
      signOutUserSuccess(data);
    } catch (error) {
      signOutUserFailure(data.message);
    }
  };

  // handle user listings
  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }

      setListings(data);
    } catch (error) {
      showListingError(true);
    }
  };

  const handleListingDelete = async (listindId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listindId}`, {
        method: "DELETE",
      });
      const data = res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      // update listing state
      setListings((prev) =>
        prev.filter((listing) => listing._id !== listindId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={imageUrl ? imageUrl : currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-center text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          Create listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer "
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer ">
          Sign out
        </span>
      </div>
      <button
        onClick={handleShowListing}
        className="text-green-700 w-full text-center"
      >
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingError ? "Error Showing Listings" : ""}
      </p>

      {listings && listings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center font-semibold text-2xl my-7">
            Your Listings
          </h1>
          {listings.map((listing) => {
            return (
              <div
                key={listing._id}
                className="border rounded-lg p-3 flex justify-between items-center gap-4"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    className="h-16 w-16 object-contain"
                    src={listing.imageUrls[0]}
                  />
                </Link>
                <Link
                  className="flex-1 text-slate-700 font-semibold  hover:underline truncate"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700 uppercase">Edit</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
