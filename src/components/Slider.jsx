import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Spinner from "./Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { Link } from "react-router-dom";
import { db } from "./../../firebase";

const Slider = () => {
  // Hooks
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  //   Swiper
  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    async function fetchListing() {
      const ListingRef = collection(db, "listings");
      const q = query(ListingRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchListing();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  if (listings.length === 0) {
    return <></>;
  }
  return (
    listings && (
      <>
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          modules={[EffectFade]}
          autoplay={{ delay: 3000 }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide key={id}>
              <Link key={id} to={`/category/${data.type}/${id}`}>
                <div
                  style={{
                    background: `url(${data.imgUrls[0]}) center, no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="relative w-full h-[400px] overflow-hidden"
                ></div>
                <p className="absolute text-[#f1faee] text-2xl font-semibold max-with-[90%] bg-[#9d7845] left-1 top-3 shadow-lg opacity-90 p-2 rounded-br-3xl ">
                  {data.name}
                </p>
                <p className="absolute text-[#f1faee] text-2xl font-semibold max-with-[90%] bg-[#2b905f] left-1 bottom-1 shadow-lg opacity-90 p-2 rounded-tr-3xl ">
                  &#8358;
                  {data.Offers
                    ? data.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : data.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  {data.type === "rent" && " / Month"}
                </p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
};

export default Slider;
