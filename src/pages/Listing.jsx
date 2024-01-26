import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import Spinner from "./../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import { FaShare, FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";
import { db } from "./../../firebase";

const Listing = () => {
  const params = useParams();
  SwiperCore.use([Autoplay, Navigation, Pagination]);

  // UseState Hooks
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  // useEffect to fetch the listing from firbase store
  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);
  if (loading) {
    return <Spinner />;
  }
  const discount = listing.regularPrice - listing.discountedPrice;
  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full h-[400px] overflow-hidden"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
      >
        <FaShare className="text-lg text-slate-500" />
      </div>
      {shareLinkCopied && (
        <p className="fixed top-[24%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">
          Link Copied
        </p>
      )}
      <div className="lg:mx-auto m-4 p-4 rounded-lg  shadow-lg bg-white lg:space-x-5">
        <div className="w-full lg:h-[400px]">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {listing.name} ___ <span>&#8358;</span>
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " / month" : ""}
          </p>
          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaLocationPin className="text-green-700 text-2xl mr-2" />
            {listing.address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center shadow-md font-semibold">
              {listing.type === "rent" ? "For Rent" : "Sale"}
            </p>
            <p>
              {listing.offer && (
                <p className="w-full max-w-[200px] bg-green-800 rounded-md p-2 text-white text-center font-semibold shadow-md">
                  <span>&#8358;</span>
                  {discount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  Discount
                </p>
              )}
            </p>
          </div>
          <p className="mt-3 mb-3">
            <span className="font-semibold">Description -</span>
            {listing.description}
          </p>
          <ul className="flex items-center space-x-2 lg:space-x-10 text-sm font-semibold">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-2" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : ""}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-2" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : ""}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-2" />
              {listing.parking ? "With Parking Space" : "No Parking Space"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-2" />
              {listing.furnished ? "Furnished" : "Not Furnished"}
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Listing;
