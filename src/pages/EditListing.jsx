import { useEffect, useState } from "react";
import Spinner from "./../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "./../../firebase";

const EditListing = () => {
  const params = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  // For Loading spinner
  const [loading, setLoading] = useState(false);
  //   for Listing
  const [listing, setListing] = useState(null);
  // Location Hook
  // const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  // formData Hook
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    // latitude: 0,
    // longitude: 0,
    images: {},
  });
  // Destructuring formData
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    // latitude,
    // longitude,
    images,
  } = formData;

  //   useEffect to check if the listing belongs to the person editing it
  useEffect(() => {
    if (listing && listing.useRef !== auth.currentUser.uid) {
      toast.error("You can't edit this listing");
      navigate("/");
    }
  }, [navigate, listing, auth.currentUser.uid]);

  //   useEffect to fetch the data from firebase store for editing
  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("This listing does not exist");
      }
    }
    fetchListing();
  }, [params.listingId, navigate]);

  // onChange function
  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    // FOr Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // For Text/Boolean/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }
  // Function to Submit the Listing Form and it Conditions
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Regular Price should be more than discounted price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum of 6 images only are allowed");
      return;
    }
    // Looping through images to get each images before storing them
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      console.log(error.message);
      setLoading(false);
      toast.error("Images not Uploaded");
    });
    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
      useRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing Edited Successfully");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  // Function to to upload each image one after thr other
  async function storeImage(image) {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  }
  // Loading Spinner
  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <main className="max-w-md px-2 mx-auto">
        <h1 className="text-3xl text-center mt-6 font-bold">Edit Listing</h1>
        <form onSubmit={onSubmit}>
          <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
          <div className="flex space-x-4">
            <button
              type="button"
              id="type"
              value="sale"
              onClick={onChange}
              className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
                type === "rent"
                  ? "bg-white text-black"
                  : "bg-slate-600 text-white"
              }`}
            >
              Sell
            </button>
            <button
              type="button"
              id="type"
              value="rent"
              onClick={onChange}
              className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
                type === "sale"
                  ? "bg-white text-black"
                  : "bg-slate-600 text-white"
              }`}
            >
              Rent
            </button>
          </div>
          <p className="text-lg mt-6 font-semibold">Name</p>
          <input
            type="text"
            id="name"
            value={name}
            placeholder="Name"
            maxLength="32"
            minLength="10"
            onChange={onChange}
            required
            className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
          />
          <div className="flex space-x-6 justify-start mb-6">
            <div>
              <p className="text-lg font-semibold">Bed Room(s)</p>
              <input
                type="number"
                id="bedrooms"
                value={bedrooms}
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white text-center border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
                onChange={onChange}
                min="1"
                max="50"
                required
              />
            </div>
            <div>
              <p className="text-lg font-semibold">Bath Room(s)</p>
              <input
                type="number"
                id="bathrooms"
                value={bathrooms}
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white text-center border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
                onChange={onChange}
                min="1"
                max="50"
                required
              />
            </div>
          </div>
          <p className="text-lg mt-6 font-semibold">Parking Space</p>
          <div className="flex space-x-4">
            <button
              type="button"
              id="parking"
              value={true}
              onClick={onChange}
              className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
                !parking ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              id="parking"
              value={false}
              onClick={onChange}
              className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
                parking ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              No
            </button>
          </div>
          <p className="text-lg mt-6 font-semibold">Furnished</p>
          <div className="flex space-x-4">
            <button
              type="button"
              id="furnished"
              value={true}
              onClick={onChange}
              className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
                !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              id="furnished"
              value={false}
              onClick={onChange}
              className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
                furnished ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              No
            </button>
          </div>
          <p className="text-lg mt-6 font-semibold">Address</p>
          <textarea
            type="text"
            id="address"
            value={address}
            placeholder="Enter Address..."
            onChange={onChange}
            required
            className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
          />
          {/* {!geolocationEnabled && (
            <div className="flex space-x-6 justify-start mb-6">
              <div className="">
                <p className="text-lg font-semibold">Latitude</p>
                <input
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={onChange}
                  min="-90"
                  max="90"
                  required
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
                />
              </div>
              <div className="">
                <p className="text-lg font-semibold">Longitude</p>
                <input
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={onChange}
                  min="-180"
                  max="180"
                  required
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
                />
              </div>
            </div>
          )} */}
          <p className="text-lg font-semibold">Description</p>
          <textarea
            type="text"
            id="description"
            value={description}
            placeholder="Description What You Are Advertising..."
            onChange={onChange}
            required
            className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
          />
          <p className="text-lg font-semibold">Offer</p>
          <div className="flex space-x-4 mb-6">
            <button
              type="button"
              id="offer"
              value={true}
              onClick={onChange}
              className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
                !offer ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              id="offer"
              value={false}
              onClick={onChange}
              className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
                offer ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              No
            </button>
          </div>
          <div className="flex items-center mb-6">
            <div className="">
              <p className="text-lg font-semibold">Regular Price</p>
              <div className="flex w-full justify-center items-center space-x-6">
                <input
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                  type="number"
                  id="regularPrice"
                  value={regularPrice}
                  onChange={onChange}
                  required
                />
                {type === "rent" && (
                  <div className="">
                    <p className="text-md w-full whitespace-nowrap">
                      <span>&#8358;</span>/Annum
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {offer && (
            <div className="flex items-center mb-6">
              <div className="">
                <p className="text-lg font-semibold">Discounted Price</p>
                <div className="flex w-full justify-center items-center space-x-6">
                  <input
                    className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                    type="number"
                    id="discountedPrice"
                    value={discountedPrice}
                    onChange={onChange}
                    required={offer}
                  />
                  {type === "rent" && (
                    <div className="">
                      <p className="text-md w-full whitespace-nowrap">
                        <span>&#8358;</span>/Annum
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="mb-6">
            <p className="text-lg font-semibold">Images</p>
            <p className="text-gray-600">
              The first image will be the cover image (max-images 6)
            </p>
            <input
              type="file"
              id="images"
              onChange={onChange}
              accept=".jpg,.png,.jpeg"
              multiple
              required
              className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:bg-white focus:border-slate-600"
            />
          </div>
          <button
            type="submit"
            className="w-full mb-6 px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-200 ease-in-out"
          >
            Update Listing
          </button>
        </form>
      </main>
    </>
  );
};

export default EditListing;
