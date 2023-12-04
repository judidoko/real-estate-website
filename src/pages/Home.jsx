import { useEffect, useState } from "react";
import Slider from "../components/Slider";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import ListingItem from "./../components/ListingItem";
import { db } from "./../../firebase";

const Home = () => {
  // Offers useState  Hooks
  const [offerListings, setOfferListings] = useState(null);
  // Rent UseState Hook
  const [rentListings, setRentListings] = useState(null);
  // Sale useState Hook
  const [saleListings, setSaleListings] = useState(null);
  // Offer useEffect Hooks to fetch offer data
  useEffect(() => {
    async function fetchListings() {
      try {
        // To get reference
        const listingsRef = collection(db, "listings");
        // To create the query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // To execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  // rent useEffect Hooks to fetch rent data
  useEffect(() => {
    async function fetchListings() {
      try {
        // To get reference
        const listingsRef = collection(db, "listings");
        // To create the query
        const q = query(
          listingsRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // To execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  // Sale useEffect Hooks to fetch sales data
  useEffect(() => {
    async function fetchListings() {
      try {
        // To get reference
        const listingsRef = collection(db, "listings");
        // To create the query
        const q = query(
          listingsRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // To execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);
  return (
    <>
      <div className="">
        <Slider />
        <div className="max-w-6xl mx-auto pt-6 space-y-6">
          {/* Offer Section */}
          {offerListings && offerListings.length > 0 && (
            <div className="m-2 mb-6">
              <h2 className="px-3 text-2xl mt-6 font-semibold">
                Recent Offers
              </h2>
              <Link to="offers">
                <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out">
                  Show More Offers
                </p>
              </Link>
              <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {offerListings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                ))}
              </ul>
            </div>
          )}
          {/* Rent  Section */}
          {rentListings && rentListings.length > 0 && (
            <div className="m-2 mb-6">
              <h2 className="px-3 text-2xl mt-6 font-semibold">
                Places For Rent
              </h2>
              <Link to="/category/rent">
                <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out">
                  Show more properties for rent
                </p>
              </Link>
              <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {rentListings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                ))}
              </ul>
            </div>
          )}
          {/* Sale  Section */}
          {saleListings && saleListings.length > 0 && (
            <div className="m-2 mb-6">
              <h2 className="px-3 text-2xl mt-6 font-semibold">
                Places For Sale
              </h2>
              <Link to="/category/sale">
                <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out">
                  Show more properties for sale
                </p>
              </Link>
              <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {saleListings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
