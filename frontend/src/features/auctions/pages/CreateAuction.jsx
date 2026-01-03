import { createAuction } from "../store/auctionSlice";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes, FaPlus } from "react-icons/fa";

const CreateAuction = () => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [authenticity, setAuthenticity] = useState("");
  const [customFields, setCustomFields] = useState([]);

  const auctionCategories = [
    "Electronics",
    "Furniture",
    "Art & Antiques",
    "Jewelry & Watches",
    "Automobiles",
    "Real Estate",
    "Collectibles",
    "Fashion & Accessories",
    "Sports Memorabilia",
    "Books & Manuscripts",
  ];

  const authenticityOptions = [
    { value: "", label: "Select Authenticity" },
    { value: "Verified", label: "Verified" },
    { value: "Warranty", label: "Warranty" },
    { value: "Certificate", label: "Certificate" },
    { value: "Unverified", label: "Unverified" },
  ];

  const imageHandler = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 6) {
      alert("You can upload maximum 6 images");
      return;
    }

    const newImages = [];
    const newPreviews = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        newImages.push(file);
        newPreviews.push(reader.result);

        if (newImages.length === files.length) {
          setImages([...images, ...newImages]);
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const addCustomField = () => {
    if (customFields.length >= 10) {
      alert("Maximum 10 custom fields allowed");
      return;
    }
    setCustomFields([...customFields, { label: "", value: "" }]);
  };

  const removeCustomField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const updateCustomField = (index, field, value) => {
    const updated = [...customFields];
    updated[index][field] = value;
    setCustomFields(updated);
  };

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auction);

  const handleCreateAuction = (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("startingBid", startingBid);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    formData.append("location", location);
    formData.append("address", address);
    formData.append("authenticity", authenticity);
    formData.append(
      "customFields",
      JSON.stringify(customFields.filter((f) => f.label && f.value))
    );
    dispatch(createAuction(formData));
  };

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  useEffect(() => {
    if (!isAuthenticated || user.role !== "Auctioneer") {
      navigateTo("/");
    }
  }, [isAuthenticated]);

  return (
    <article className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
      <h1
        className={`text-golden-500 whitestone:text-gray-900 text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
      >
        Create Auction
      </h1>
      <div className="bg-gradient-to-br from-burgundy-950/20 to-golden-950/10 dark:from-black/20 dark:to-gray-950/10 whitestone:bg-white/30 whitestone:backdrop-blur-xl backdrop-blur-sm whitestone:backdrop-blur-xl mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md border-2 border-golden-400 whitestone:border-white/30 shadow-2xl">
        <form
          className="flex flex-col gap-5 w-full"
          onSubmit={handleCreateAuction}
        >
          <p className="font-semibold text-xl md:text-2xl">Auction Detail</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-col sm:flex-1">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none text-warm-white focus:border-b-golden-300 transition-all"
              />
            </div>
            <div className="flex flex-col sm:flex-1">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none text-warm-white focus:border-b-golden-300 transition-all"
              >
                <option value="">Select Category</option>
                {auctionCategories.map((element) => {
                  return (
                    <option key={element} value={element}>
                      {element}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-col sm:flex-1">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none text-warm-white"
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-1">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                Starting Bid
              </label>
              <input
                type="number"
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-col sm:flex-1">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-[16px] py-2 bg-transparent border-2 border-golden-400 whitestone:border-white/30 focus:outline-none px-2 rounded-md"
                rows={10}
              />
            </div>
          </div>

          {/* Item Details Section */}
          <p className="font-semibold text-xl md:text-2xl mt-4">
            Item Details (Optional)
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-col sm:flex-1">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York, NY, USA"
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none text-warm-white placeholder-golden-300/50"
              />
            </div>
            <div className="flex flex-col sm:flex-1">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                Authenticity
              </label>
              <select
                value={authenticity}
                onChange={(e) => setAuthenticity(e.target.value)}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none text-warm-white"
              >
                {authenticityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., 62 W 47th St, New York, NY 10036"
              className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none text-warm-white placeholder-golden-300/50"
            />
          </div>

          {/* Custom Fields Section */}
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-xl md:text-2xl">
                Custom Fields (Max 10)
              </p>
              <button
                type="button"
                onClick={addCustomField}
                disabled={customFields.length >= 10}
                className="bg-gold-gradient shadow-lg border-2 border-golden-400 whitestone:border-white/30 font-semibold text-sm transition-all duration-300 py-2 px-4 rounded-md text-warm-white btn-hover whitestone:text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPlus /> Add Field
              </button>
            </div>
            {customFields.map((field, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 items-start sm:items-end"
              >
                <div className="flex flex-col flex-1">
                  <label className="text-[14px] text-golden-300 whitestone:text-gray-900">
                    Field Name
                  </label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) =>
                      updateCustomField(index, "label", e.target.value)
                    }
                    placeholder="e.g., Year, Gender, Water resistance"
                    className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none text-warm-white placeholder-golden-300/50"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-[14px] text-golden-300 whitestone:text-gray-900">
                    Value
                  </label>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) =>
                      updateCustomField(index, "value", e.target.value)
                    }
                    placeholder="e.g., 2022, Men, 100m"
                    className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none text-warm-white placeholder-golden-300/50"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomField(index)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-all"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-col sm:flex-1">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                Auction Starting Time
              </label>
              <DatePicker
                selected={startTime}
                onChange={(date) => setStartTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat={"MMMM d, yyyy h,mm aa"}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-1">
              <label className="text-[16px] text-golden-300 whitestone:text-gray-900">
                Auction End Time
              </label>
              <DatePicker
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat={"MMMM d, yyyy h,mm aa"}
                className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-golden-400 whitestone:border-b-gray-400 focus:outline-none w-full"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <label className="font-semibold text-xl md:text-2xl">
              Auction Item Images (1-6 images required)
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {imagePreviews.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-32 h-32 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeImage(index);
                            }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          >
                            <FaTimes size={12} />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-0 left-0 right-0 bg-golden-500 text-white text-xs text-center py-1">
                              Thumbnail
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 mb-4 text-golden-300 whitestone:text-gray-900"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-golden-300 whitestone:text-gray-900">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-golden-300 whitestone:text-gray-900">
                        PNG, JPG or WEBP (Max 6 images)
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={imageHandler}
                  disabled={images.length >= 6}
                />
              </label>
            </div>
            {images.length > 0 && (
              <p className="text-sm text-golden-300 whitestone:text-gray-900">
                {images.length} / 6 images uploaded. First image will be the
                thumbnail.
              </p>
            )}
          </div>
          <button className="bg-gold-gradient shadow-lg border-2 border-golden-400 whitestone:border-white/30 font-semibold text-xl transition-all duration-300 py-2 px-4 rounded-md text-warm-white w-[280px] mx-auto lg:w-[640px] my-4 btn-hover whitestone:text-white">
            {loading ? "Creating Auction..." : "Create Auction"}
          </button>
        </form>
      </div>
    </article>
  );
};

export default CreateAuction;
