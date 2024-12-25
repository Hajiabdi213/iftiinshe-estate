import { useState } from "react";
// import useUserStore from "../store/user.store";

import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/AppContext";

const CreateListingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  // State to hold the files selected for upload
  const [files, setFiles] = useState([]);

  // State to store the image URLs in an array
  const [imageUrls, setImageUrls] = useState([]); // [ 'url1', 'url2', ... ]

  // state to manager image upload error
  const [imageUploadError, setImageUploadError] = useState(null);

  // State to manage image upload

  const [uploadingImages, setUploadingImages] = useState(false);
  // State to check errors when saving data
  const [error, setError] = useState(false);
  // state to manage loading when saving
  const [loading, setLoading] = useState(false);

  // Handle changes when files are selected
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 6) {
      setImageUploadError("You can only upload up to 6 images.");
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  // other form data
  const [listingData, setListingData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedRooms: 1,
    bathRooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  // Handle image submission to Cloudinary
  const handleImageSubmit = async () => {
    if (files.length === 0) {
      setImageUploadError("Please select at least one image to upload.");
      return;
    }

    setUploadingImages(true);
    setImageUploadError(null);

    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "test-mern-project");
          formData.append("api_key", "599582733417938");

          const response = await fetch(
            "https://api.cloudinary.com/v1_1/dpuanuspp/image/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();
          return data.secure_url;
        })
      );

      setImageUrls((prevUrls) => [...prevUrls, ...uploadedUrls]);
      setListingData((prevData) => ({
        ...prevData,
        imageUrls: [...prevData.imageUrls, ...uploadedUrls],
      }));
      setFiles([]);
    } catch (error) {
      setImageUploadError("Failed to upload images. Please try again.");
      console.error("Error uploading images:", error);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    setListingData((prevData) => ({
      ...prevData,
      imageUrls: prevData.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // handling form input changes
  const handleInputChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setListingData({
        ...listingData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setListingData({
        ...listingData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setListingData({
        ...listingData,
        [e.target.id]: e.target.value,
      });
    }
  };

  // let's submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // check if image is uploaded first
      if (listingData.imageUrls.length < 1)
        return setError("You must upload at least 1 image");

      // check discount not to be more than regular price
      if (+listingData.regularPrice < listingData.discountPrice)
        return setError("Discount price must be lower than the regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...listingData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);

      // Check here - success
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  // console.log(listingData);
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create A Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name.."
            id="name"
            maxLength={62}
            minLength={10}
            required
            className="border p-3 rounded-lg "
            onChange={handleInputChange}
            value={listingData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            id="description"
            required
            className="border p-3 rounded-lg "
            onChange={handleInputChange}
            value={listingData.description}
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            required
            className="border p-3 rounded-lg "
            onChange={handleInputChange}
            value={listingData.address}
          />
          {/* checkboxes */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name=""
                id="sale"
                className="w-5 h-5"
                onChange={handleInputChange}
                checked={listingData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name=""
                id="rent"
                className="w-5 h-5"
                onChange={handleInputChange}
                checked={listingData.type === "rent"}
              />{" "}
              <span>Rent</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name=""
                id="parking"
                className="w-5 h-5"
                onChange={handleInputChange}
                checked={listingData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name=""
                id="furnished"
                className="w-5 h-5"
                onChange={handleInputChange}
                checked={listingData.furnished}
              />{" "}
              <span>Furnished</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                name=""
                id="offer"
                className="w-5 h-5"
                onChange={handleInputChange}
                checked={listingData.offer}
              />{" "}
              <span>Offer</span>
            </div>
          </div>
          {/* more inputs */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedRooms"
                min={1}
                max={10}
                required
                className="p-3 border  border-gray-300 rounded-lg"
                onChange={handleInputChange}
                value={listingData.bedRooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathRooms"
                min={1}
                max={10}
                required
                className="p-3 border  border-gray-300 rounded-lg"
                onChange={handleInputChange}
                value={listingData.bathRooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                required
                min={50}
                className="p-3 border  border-gray-300 rounded-lg"
                onChange={handleInputChange}
                value={listingData.regularPrice}
              />
              <div className="flex flex-col gap-2 items-center">
                {" "}
                <p>Regular Price</p>
                <span className="text-xs">(% / month)</span>
              </div>
            </div>
            {listingData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  required
                  className="p-3 border  border-gray-300 rounded-lg"
                  onChange={handleInputChange}
                  value={listingData.discountPrice}
                />

                <div className="flex flex-col gap-2 items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">(% / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4 ">
          <p className="font-semibold ">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first images will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={handleFileChange}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="iamges"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={loading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploadingImages ? "Uploading" : "Upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>
          {/* show images */}
          {imageUrls.length > 0 &&
            imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center "
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg "
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  type="button"
                  className="p-3 text-red-700 rounded-lg uppercase hover:bg-opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploadingImages}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating ...." : "Create Listing"}
          </button>
          {error && <p className="text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListingPage;
