import Moment from "react-moment";
import { Link } from "react-router-dom";
import { MdLocationOn, MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import PropTypes from "prop-types";
import Listing from "../pages/Listing";

const ListingItem = ({ listing, id, onDelete, onEdit }) => {
  return (
    <>
      <li className="bg-white relative flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]">
        <Link className="contents" to={`/category/${listing.type}/${id}`}>
          <img
            className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
            loading="lazy"
            src={listing.imgUrls[0]}
            alt="Background"
          />
          <Moment
            className="absolute top-2 left-2 bg-[#0729] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
            fromNow
          >
            {listing.timestamp?.toDate()}
          </Moment>
          <div className="w-full p-[10px]">
            <div className="flex items-center space-x-1">
              <MdLocationOn className="h-4 w-4 text-green-600" />
              <p className="font-semibold text-sm md-[2px] text-gray-600 truncate">
                {listing.address}
              </p>
            </div>
            <p className="font-semibold m-0 text-xl truncate ">
              {listing.name}
            </p>
            <p className="text-[#457b9d] mt-2 font-semibold">
              &#8358;
              {listing.Offers
                ? listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              {listing.type === "rent" && "/month"}
            </p>
            <div className="flex items-center mt-[10px] space-x-3">
              <div className="flex items-center space-x-1">
                <p className="font-bold text-xs">
                  {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : ""}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <p className="font-bold text-xs">
                  {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : ""}
                </p>
              </div>
            </div>
          </div>
        </Link>
        {onDelete && (
          <FaTrash
            className="absolute bottom-2 right-2 h-[14px] cursor-pointer  text-red-600"
            onClick={() => onDelete(listing.id)}
          />
        )}
        {onEdit && (
          <MdEdit
            className="absolute bottom-2 right-9 h-4 cursor-pointer"
            onClick={() => onEdit(listing.id)}
          />
        )}
      </li>
    </>
  );
};

Listing.propTypes = {
  listing: PropTypes.string,
  id: PropTypes.string,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

export default ListingItem;
